<template>
  <div class="p-3">
    <div class="table-responsive custom-table-responsive">
      <table class="table custom-table mt-5">
        <thead class="table-dark">
          <tr class="text-center">
            <th class="border border-dark" scope="col"></th>
            <template v-if="examQuestions">
              <th class="" v-for="(q, index) in examQuestions" :key="q.id">
                Q {{ index+1 }}
              </th>
            </template>
            <!-- <th class="border border-dark" scope="col">Q 1</th>
          <th class="border border-dark" scope="col">Q 2</th>
          <th class="border border-dark" scope="col">Q 3</th>
          <th class="border border-dark" scope="col">Q 4</th>
          <th class="border border-dark" scope="col">Q 5</th>
          <th class="border border-dark" scope="col">Q 6</th>
          <th class="border border-dark" scope="col">Q 7</th>
          <th class="border border-dark" scope="col">Q 8</th>
          <th class="border border-dark" scope="col">Q 9</th>
          <th class="border border-dark" scope="col">Q 10</th> -->
            <th class="border border-dark" scope="col">Total Score</th>
            <th class="border border-dark" scope="col">Percent Score</th>
            <th class="border border-dark" scope="col">Grade</th>
          </tr>
        </thead>
        <tbody class="border border-dark">
          <tr class="text-center">
            <th class="border border-dark" scope="col">Answer Key</th>
            <template v-if="answerKeys">
              <th
                class="border border-dark"
                v-for="ak in sortedAnswerKeys"
                :key="ak.idQ"
                scope="col"
              >
                {{ ak.charKey }}
                {{ ak.context }}
              </th>
            </template>
            <th class="border border-dark" scope="col">50</th>
            <th class="border border-dark" scope="col">100</th>
            <th class="border border-dark" scope="col">12</th>
          </tr>

          <template v-if="report">
            <tr class="text-center" v-for="r in report" :key="r.id">
              <th class="border border-dark" scope="row">
                {{ r.user }}
              </th>
              <!-- <th class="border border-dark" v-for="qu in r.questionUnits" :key="qu.questionId" scope="row">{{qu.currentKeys}}</th> -->
              <!-- :class="r.questionUnits.find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.includes(ak.charKey)? 'is-correct' : 'is-incorrect'" -->
              <th
                class="border border-dark"
                v-for="ak in sortedAnswerKeys"
                :key="ak.idQ"
                scope="row"
                :class="{
                  'is-correct': r.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.includes(ak.charKey),
                    'is-incorrect':  !r.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.includes(ak.charKey),
                    'is-test':r.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys==='answer'
                }"
              >
                {{
                  r.questionUnits.find((x) => x.questionId === ak.idQ)
                    ?.currentKeys || "-"
                }}
              </th>

              <td class="border border-dark">-</td>
              <td class="border border-dark">-</td>
              <td class="border border-dark">-</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import reportService from "@/_services/reportService.js";
import examService from "@/_services/examService.js";
import userService from "@/_services/userService.js";
import answerService from "@/_services/answerService.js";
import questionService from "@/_services/questionService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { computed, onMounted, ref, getCurrentInstance } from "vue";
export default {
  props: ["idExam"],
  setup(props) {
    const { getReportsByExamId } = reportService();
    const { getAllExamQuestions, getExamById } = examService();
    const { getQuestionById } = questionService();
    const { getQuestionAnswers } = answerService();
    const { getById } = userService();
    const report = ref(null);
    const examQuestions = ref(null);
    const exam = ref(null);
    const questions = ref(null);
    const answerKeys = ref([]);
    const userAnswers = ref([]);
 const toast = getCurrentInstance().appContext.app.$toast;
    onMounted(async () => {
      //Get data of Report by exam id
      let response = await getReportsByExamId(props.idExam);

      if (response && response.value) {
        if (response.value.status === 200) {
          report.value = response.value.data;

          await report.value.reduce(async (a, el) => {
              console.log(el);
            //   el.currentKeys = el.currentKeys.replace(",", "");
            let res = await getById(el.applicantId);
            if (res && res.value) {
              if (res.value.status === 200) {
                el.user = res.value.data.firstName + " " + res.value.data.lastName;
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
                });
              }
            }

            // element.questionUnits.sort(
            //   (x1, x2) => x1.questionItemId - x2.questionItemId
            // );
          }, Promise.resolve());
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      // Get all exam questions
      let responseEQ = await getAllExamQuestions(props.idExam);

      if (responseEQ && responseEQ.value) {
        if (responseEQ.value.status) {
          examQuestions.value = responseEQ.value.data.items;
          examQuestions.value.sort(
            (x1, x2) => x1.questionItemId - x2.questionItemId
          );
          questions.value = [];
          await examQuestions.value.reduce(async (a, element) => {
            let res = await getQuestionById(element.questionItemId);

            if (res && res.value) {
              if (res.value.status === 200) {
                let q = res.value.data;

                //Get answers of question
                let resQ = await getQuestionAnswers(q.id);

                if (resQ && resQ.value) {
                  if (resQ.value.status === 200) {
                    q.questionAnswers = resQ.value.data;

                    let arr1 = resQ.value.data.filter((x) => x.isCorrectAnswer);
                    let arr2 = [];
                    arr1.forEach((element) => {
                      arr2.push(element.charKey);
                    });

                    let arr3 = arr2.join("");

                    answerKeys.value.push({ idQ: q.id, charKey: arr3 });
                  } else {
                    handleResponse(resQ.value).forEach((element) => {
                      toast.error(element, {
                        position: "top",
                        duration: 5000,
                      });
                    });
                  }
                }

                questions.value.push(res.value.data);
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
                });
              }
            }
          }, Promise.resolve());
        } else {
          handleResponse(responseEQ.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      //Get Exam data
      let responseE = await getExamById(props.idExam);

      if (responseE && responseE.value) {
        if (responseE.value.status) {
          exam.value = responseE.value.data;
        } else {
          handleResponse(responseE.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    });

    const sortedAnswerKeys = computed(() => {
      return answerKeys?.value.sort((x1, x2) => x1.idQ - x2.idQ);
    });

    return {
      sortedAnswerKeys,
      report,
      exam,
      examQuestions,
      questions,
      answerKeys,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";

.is-correct {
  background: darkgreen;
  color: white;
}
.is-incorrect {
  background: darkred;
  color: white;
}
.is-test {
     background: darkgoldenrod;
  color: white;
}
</style>