<template>
  <div class="p-3">
    <router-link :to="{ name: 'ReportsList' }" class="btn btn-outline-info">
      <i><font-awesome-icon icon="circle-arrow-left" /></i>
    </router-link>
    <div v-if="exam" class="mt-3">
      <h3 class="text-white">
        {{exam.title}}
      </h3>
      <hr class="bg-info" />
    </div>
    <div class="d-flex">
      <h3 class="legends-style">Legends:</h3>
      <div class="answer-style is-correct text-center">
        <span>correct answer</span>
      </div>
      <div class="answer-style is-incorrect text-center">
        <span>incorrect answer</span>
      </div>
    </div>
    <div class="table-responsive custom-table-responsive">
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
            <th class="border border-dark c-content" scope="col">Answer Key</th>
            <template v-if="answerKeys">
              <th
                v-for="ak in sortedAnswerKeys"
                :key="ak.idQ"
                scope="col"
                class="border border-dark"
                style="min-width: 70px"
              >
                {{ ak.charKey }}
              </th>
            </template>
            <th class="border border-dark" scope="col">100</th>
            <th class="border border-dark" scope="col">{{examQuestions?.length || 0}}</th>
            <th class="border border-dark" scope="col"></th>
          </tr>

          <template v-if="report">
            <tr class="text-center">
              <th class="border border-dark c-content" scope="row">
                {{ report.user }}
              </th>
              <!-- <th class="border border-dark" v-for="qu in r.questionUnits" :key="qu.questionId" scope="row">{{qu.currentKeys}}</th> -->
              <!-- :class="r.questionUnits.find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.includes(ak.charKey)? 'is-correct' : 'is-incorrect'" -->
              <th
                class="border border-dark"
                v-for="ak in sortedAnswerKeys"
                :key="ak.idQ"
                scope="row"
               
              >
              <div class="cell-style"
               :class="
                  report.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.split(',')
                    .sort()
                    .join('') === ak.charKey
                    ? 'is-correct'
                    : 'is-incorrect'
                ">
                {{
                  report.questionUnits
                    .find((x) => x.questionId === ak.idQ)
                    ?.currentKeys.replaceAll(",", "") || "-"
                }}

              </div>
              </th>

              <td class="border border-dark">{{ report.persentScore }}</td>
              <td class="border border-dark">{{ report.totalScore }}</td>
              <td class="border border-dark">{{ report.grade || "-" }}</td>
              <td class="border border-dark">
                {{ new Date(report.reportDate).toLocaleDateString() }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <button
      class="btn btn-outline-danger mt-3"
      @click="deleteHandle"
      :disabled="loading"
    >
      Delete
    </button>
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
import { useRouter } from "vue-router";
export default {
  props: ["idReport"],
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);
    const router = useRouter();

    const { getReportById, removeReport } = reportService();
    const { getAllExamQuestions, getExamById } = examService();
    const { getQuestionById } = questionService();
    const { getQuestionAnswers } = answerService();
    const { getUserById } = userService();

    const report = ref(null);
    const examQuestions = ref(null);
    const exam = ref(null);

    const questions = ref(null);
    const answerKeys = ref([]);

    onMounted(async () => {
      //Get data of Report by exam id
      let response = await getReportById(props.idReport);

      if (response && response.value) {
        if (response.value.status === 200) {
          report.value = response.value.data;
          console.log(report.value);

          let resUser = await getUserById(report.value.applicantId);
          if (resUser && resUser.value) {
            if (resUser.value.status === 200) {
              report.value.user =
                resUser.value.data.firstName +
                " " +
                resUser.value.data.lastName;
            } else {
              handleResponse(resUser.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
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

      if (report.value) {
        // Get all exam questions
        let responseEQ = await getAllExamQuestions(report.value.examId);

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

        let resExam = await getExamById(report.value.examId);

        if(resExam && resExam.value) {
          if(resExam.value.status === 200) {
            exam.value = resExam.value.data;
          } else {
             handleResponse(resExam.value).forEach((element) => {
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

    const deleteHandle = async () => {
      loading.value = true;
      let response = await removeReport(props.idReport);

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Report removed successfully");
          router.push({ name: "ReportsList" });
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      loading.value = false;
    };
    return {
      sortedAnswerKeys,
      report,
      loading,
      examQuestions,
      exam,
      questions,
      answerKeys,
      deleteHandle,
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
 .cell-style
{
  border: 2px solid #535353;
  border-radius: 8px;
  color: white;
} 
.legends-style
{
  color: #737373;
}
.answer-style
{
  position: relative;
  width: 160px;
  margin-inline: 10px;
  color:#fff;
  padding: 5px;
  border: 2px solid #535353;
  border-radius: 6px;
}
</style>