<template>
  <div class="p-3">
    <router-link :to="{ name: 'ReportsByExamList' }" class="btn btn-outline-info">
      <i><font-awesome-icon icon="circle-arrow-left" /></i>
    </router-link>
    <h3 class="text-white">Results</h3>
    <hr class="bg-info" />
    <div
      class="table-responsive custom-table-responsive"
      v-if="examQuestions"
    >
      <table class="table custom-table mt-5">
        <thead class="table-dark">
          <tr class="text-center">
            <th class="border border-dark" scope="col"></th>
            <template v-if="examQuestions">
              <th class="" v-for="(q, index) in examQuestions" :key="q.id">
                {{ index + 1 }}
              </th>
            </template>
            <th class="border border-dark" scope="col">Percent Score</th>
            <th class="border border-dark" scope="col">Total Score</th>
            <th class="border border-dark" scope="col">Grade</th>
            <th class="border border-dark" scope="col">Date</th>
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
            <th class="border border-dark" scope="col">100</th>
            <th class="border border-dark" scope="col"></th>
            <th class="border border-dark" scope="col"></th>
          </tr>

          <template v-if="reports">
            <tr class="text-center" v-for="r in reports" :key="r.id">
              <th class="border border-dark c-content" scope="row">
                {{ r.user }}
              </th>
              <!-- <th class="border border-dark" v-for="qu in r.questionUnits" :key="qu.questionId" scope="row">{{qu.currentKeys}}</th> -->
              <!-- :class="r.questionUnits.find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.includes(ak.charKey)? 'is-correct' : 'is-incorrect'" -->
              <th
                class="border border-dark"
                style="min-width: 50px"
                v-for="ak in sortedAnswerKeys"
                :key="ak.idQ"
                scope="row"
                :class="
                  r.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.split(',')
                    .sort()
                    .join('') === ak.charKey
                    ? 'is-correct'
                    : 'is-incorrect'
                "
              >
                {{
                  r.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.replaceAll(",", "") || "-"
                }}
              </th>

              <td class="border border-dark">{{ r.persentScore }}</td>
              <td class="border border-dark">{{ r.totalScore }}</td>
              <td class="border border-dark">{{ r.grade || "-" }}</td>
              <td class="border border-dark">
                {{ new Date(r.reportDate).toLocaleDateString() }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center" v-if="!examQuestions">
      <div
        class="spinner-border align-center text-primary text-center"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
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
    const toast = getCurrentInstance().appContext.app.$toast;
    
    const examQuestions = ref(null);
    const reports = ref(null);
    const questions = ref(null);
    const answerKeys = ref([]);

    const { getReportsByExamId } = reportService();
    const { getAllExamQuestions, getExamById } = examService();
    const { getQuestionById } = questionService();
    const { getQuestionAnswers } = answerService();
    const { getUserById } = userService();

    onMounted(async () => {
      //Get data of Report by exam id
      let response = await getReportsByExamId(props.idExam);

      if (response && response.value) {
        if (response.value.status === 200) {
          reports.value = response.value.data;
          console.log(reports.value);

          for (const iterator of reports.value) {
            let res = await getUserById(iterator.applicantId);
            if (res && res.value) {
              if (res.value.status === 200) {
                iterator.user =
                  res.value.data.firstName + " " + res.value.data.lastName;
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
                });
              }
            }
          }
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      if (reports.value) {
        // Get all exam questions
        let responseEQ = await getAllExamQuestions(props.idExam);

        if (responseEQ && responseEQ.value) {
          if (responseEQ.value.status) {
            examQuestions.value = responseEQ.value.data.items;
            examQuestions.value.sort(
              (x1, x2) => x1.questionItemId - x2.questionItemId
            );
            questions.value = [];

            for (const iterator of examQuestions.value) {
              let res = await getQuestionById(iterator.questionItemId);

              if (res && res.value) {
                if (res.value.status === 200) {
                  let q = res.value.data;

                  //Get answers of question
                  let resQ = await getQuestionAnswers(q.id);

                  if (resQ && resQ.value) {
                    if (resQ.value.status === 200) {
                      q.questionAnswers = resQ.value.data;

                      let arr1 = resQ.value.data.filter(
                        (x) => x.isCorrectAnswer
                      );
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

                  questions.value.push(q);
                } else {
                  handleResponse(res.value).forEach((element) => {
                    toast.error(element, {
                      position: "top",
                      duration: 5000,
                    });
                  });
                }
              }
            }
          } else {
            handleResponse(responseEQ.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }
    });

    const sortedAnswerKeys = computed(() => {
      return answerKeys?.value.sort((x1, x2) => x1.idQ - x2.idQ);
    });

    return {
      sortedAnswerKeys,
      reports,
      examQuestions,
      questions,
      answerKeys,
    };
  },
};
</script>

<style scoped>
@import "../../../../assets/css/table.css";

.c-content {
  min-width: max-content;
  white-space: nowrap;
}

.is-correct {
  background: darkgreen;
  color: white;
}
.is-incorrect {
  background: darkred;
  color: white;
}
</style>