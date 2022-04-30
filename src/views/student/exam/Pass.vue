<template>
  <div class="p-3" v-if="exam && !isFinish">
    <div class="row">
      <div class="col-md-6">
        <h1 class="text-white">Exam: {{ exam.title }}</h1>
      </div>
      <div class="col-md-6">
        <h1 class="text-white">
          <span>{{ minutes }}</span>
          <span>:</span>
          <span>{{ seconds }}</span>
        </h1>
      </div>
    </div>

    <div v-if="question">
      <div>
        <h4 class="text-white">
          <span> {{ question.context }}</span>
        </h4>
      </div>
      <div>
        <div v-if="question.answerType === 2">
          <h5 class="text-white text-center">Multy answer !!</h5>
        </div>
        <div v-if="question.answerType === 0">
          <input
            type="text"
            class="form-control c-input"
            placeholder="enter answer"
            v-model="answerInput"
          />
        </div>
        <div v-if="question.answerType === 1 || question.answerType === 2">
          <ul style="list-style-type: none">
            <li
              class="text-white border m-2 p-2"
              v-for="answer in question.answers"
              :key="answer.id"
              @click="toggleAnswer(answer)"
              :class="{
                'bg-secondary':
                  userAnswers
                    ?.find((x) => x.idQuesiton === question.id)
                    ?.answers.filter((x) => x === answer.charKey).length > 0,
              }"
            >
              <p>{{ answer.id }}</p>
              <span class="p-1 m-2">{{ answer.charKey }}</span>
              <span>{{ answer.context }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <div class="pagination w-auto d-flex justify-content-center">
          <ul>
            <li class="btn prev" @click="prevQuestion">Prev</li>
            <li class="numb"  :class="{
                'bg-warning text-black': userAnswers?.find(
                  (x) => x.idQuesiton === questionsItems[0].id
                ),
              }" @click="firstHandle" v-if="currentQuestion >= 10">
              1
            </li>
            <li class="dots" v-if="currentQuestion >= 10">...</li>
            <li
              style="cursor: pointer"
              class="numb"
              :class="{
                'bg-warning text-black': userAnswers?.find(
                  (x) => x.idQuesiton === questionsItems[page - 1].id
                ),
                active: page === currentQuestion,
              }"
              v-for="page in pagination.pages"
              :key="page"
              @click="changeQuestion(page)"
            >
              {{ page }}
            </li>
            <li
              class="dots"
              v-if="
                !pagination.pages.includes(pagination.totalPages) &&
                pagination.totalPages > 0
              "
            >
              ...
            </li>
            <li
              class="numb"
              @click="lastHandle"
              v-if="
                !pagination.pages.includes(pagination.totalPages) &&
                pagination.totalPages > 0
              "
               :class="{
                'bg-warning text-black': userAnswers?.find(
                  (x) => x.idQuesiton === questionsItems[pagination.totalPages - 1].id
                ),
              }"
            >
              {{ pagination.totalPages }}
            </li>
            <li class="btn next" @click="nextQuestion">Next</li>
            <li class="btn " @click="finishExam">Finish</li>
          </ul>
        </div>
      </div>
      <!-- <div class="text-white">{{ userAnswers }}</div> -->
    </div>
  </div>
    <div
      class="d-flex justify-content-center"
      v-if="!exam || !question || isFinish || !idReport"
    >
      <div
        class="spinner-border align-center text-primary text-center"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
</template>
<script>
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import reportService from "@/_services/reportService.js";
import questionService from "@/_services/questionService.js";
import answerService from "@/_services/answerService.js";
import authService from "@/_services/authService.js";
import userService from "@/_services/userService.js";
import { onMounted, ref, computed, getCurrentInstance, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import paginate from "@/_helpers/paginate.js";
export default {
  props: ["idExam"],
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;
    const isFinish = ref(false);
    const router = useRouter();

    var timer = null;
    const minutes = ref(0);
    const seconds = ref(0);

    const { currentUser } = authService();
    const { currentAnswer, openReport, closeReport } = reportService();
    const { getExamById, getAllExamQuestions } = examService();
    const { getQuestionById } = questionService();
    const { getQuestionAnswers } = answerService();
    const { getUserExams } = userService();

    const exam = ref(null);
    const examQuestions = ref(null);
    const questions = ref(null);
    const question = ref(null);
    const currentQuestion = ref(1);
    const answerInput = ref(null);
    const idReport = ref(null);

    const userAnswers = ref([]);

    const pagination = ref({ pages: [1], totalPages: 1 });

    onMounted(async () => {
      let resUser = await getUserExams(currentUser.value.id);

      if (resUser && resUser.value) {
        if (resUser.value.status === 200) {
          if (
            !resUser.value.data.items.find(
              (x) => x.examId === Number.parseInt(props.idExam)
            )
          ) {
            router.push({ name: "ExamsStudent" });
          }
        } else {
          handleResponse(resUser.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      //Create new report

      if (!sessionStorage.idReport) {
        let resReport = await openReport({
          applicantId: currentUser.value.id,
          examId: props.idExam,
        });

        if (resReport && resReport.value) {
          if (resReport.value.status === 200) {
            idReport.value = resReport.value.data;
            sessionStorage.idReport = idReport.value;
          } else {
            handleResponse(resReport.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
            router.push({ name: "ExamsStudent" });
            return;
          }
        }
      } else {
        idReport.value = sessionStorage.idReport;
      }

      //Get exam data
      let response = await getExamById(props.idExam);
      if (response && response.value) {
        if (response.value.status === 200) {
          exam.value = response.value.data;
          console.log( response.value.data);
          if (sessionStorage.time) {
            let time = JSON.parse(sessionStorage.time);
            minutes.value = time.minutes;
            seconds.value = time.seconds;
          } else {
            minutes.value =  response.value.data.durationTime;
            seconds.value = 0;
          }

          //Get exam questions
          let res = await getAllExamQuestions(props.idExam);

          if (res && res.value) {
            if (res.value.status === 200) {
              examQuestions.value = res.value.data.items;

              questions.value = [];

              //Get question data
              for await (const iterator of examQuestions.value) {
                let resQ = await getQuestionById(iterator.questionItemId);
                if (resQ && resQ.value) {
                  if (resQ.value.status === 200) {
                    let item = resQ.value.data;
                    //Gets answers of question
                    let resA = await getQuestionAnswers(item.id);

                    if (resA && resA.value) {
                      if (resA.value.status === 200) {
                        item.answers = resA.value.data;
                        questions.value.push({
                          ...item,
                          answers: resA.value.data.sort((x1 ,x2)=> x1.charKey.localeCompare(x2.charKey) ),
                        });
                      } else {
                        handleResponse(resA.value).forEach((element) => {
                          toast.error(element, {
                            position: "top",
                            duration: 5000,
                          });
                        });
                      }
                    }
                  } else {
                    handleResponse(resQ.value).forEach((element) => {
                      toast.error(element, {
                        position: "top",
                        duration: 5000,
                      });
                    });
                  }
                }
              }
              startTimer();
            } else {
              handleResponse(res.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
            }
          }

          question.value = questionsItems.value[0];

          if (sessionStorage.answers) {
            userAnswers.value = JSON.parse(sessionStorage.answers);
            changeQuestion(currentQuestion.value);
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
    });

    onUnmounted(() => {
      console.log("ONMOUNTED******************");
      clearInterval(timer);
      sessionStorage.removeItem("idReport");
      sessionStorage.removeItem("time");
      sessionStorage.removeItem("answers");
    });

    /**
     * Changes question
     */
    const changeQuestion = async (index) => {
      // if(currentQuestion.value === index) return;

      console.log("Index: ", index);
      if (question.value?.answerType === 0) {
        if (answerInput.value || answerInput.value === "") {
           toggleAnswer(answerInput.value);
        }
      }

      await sendAnswer();

      currentQuestion.value = index;
      question.value = questionsItems.value[index - 1];

      answerInput.value = null;

      //Set answer in the inputAnswer
      if (question.value.answerType === 0) {
        let obj = userAnswers.value?.find(
          (x) => x.idQuesiton === question.value.id
        );

        if (obj) {
          answerInput.value = obj.answers[0];
        }
      }
    };


    /**
     * Sends answer into db
     */
    const sendAnswer = async () => {
      let obj = userAnswers.value.find(
        (x) => x.idQuesiton === question.value.id
      );

      if (obj && (obj.status === "New" || obj.status === "Modify")) {
        let response = await currentAnswer({
          reviewId: idReport.value,
          questionId: question.value.id,
          currentKeys: obj.answers.join(","),
        });

        if (response && response.value) {
          if (response.value.status === 200) {
            obj.status = "Added";
            sessionStorage.answers = JSON.stringify(userAnswers.value);
          } else {
            handleResponse(response.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }
    };

    /**
     * Changes answer
     */
    const toggleAnswer = (answer) => {
      if (question.value) {
        if (question.value.answerType === 0) {
          let obj = userAnswers.value.findIndex(
            (x) => x.idQuesiton === question.value.id
          );

          if (obj >= 0) {
            userAnswers.value[obj].status = "Modify";
            //userAnswers.value.splice(obj, 1);
            userAnswers.value[obj].answers = [answerInput.value];

            // let item = {};
            // item.idQuesiton = question.value.id;
            // item.answers = [answerInput.value];
            // userAnswers.value.push(item);

            return;
          }

          let item = {};
          item.idQuesiton = question.value.id;
          item.answers = [answerInput.value];
          item.status = "New";
          userAnswers.value.push(item);

          return;
        }
        if (question.value.answerType === 1) {
          let obj = userAnswers.value.find(
            (x) => x.idQuesiton === question.value.id
          );

          if (obj) {
            if (obj.status === "Added") {
              obj.status = "Modify";
            }
            obj.answers = [];
            obj.answers = [answer.charKey];

            return;
          } else {
            let item = {};
            item.idQuesiton = question.value.id;
            item.answers = [answer.charKey];
            item.status = "New";

            userAnswers.value.push(item);
          }
        }
        if (question.value.answerType === 2) {
          let obj = userAnswers.value.find(
            (x) => x.idQuesiton === question.value.id
          );

          if (obj) {
            if (obj.status === "Added") {
              obj.status = "Modify";
            }

            if (obj.answers.find((x) => x === answer.charKey)) {
              obj.answers = obj.answers.filter((x) => x !== answer.charKey);

              if (obj.answers.length === 0) {
                userAnswers.value = userAnswers.value.filter(
                  (x) => x.idQuesiton !== question.value.id
                );
              }

              return;
            } else {
              obj.answers.push(answer.charKey);
              return;
            }
          } else {
            let item = {};
            item.idQuesiton = question.value.id;
            item.answers = [answer.charKey];
            item.status = "New";

            userAnswers.value.push(item);
          }
        }
      }
    };

    /**
     * Finish exam
     */
    const finishExam = async () => {
      clearInterval(timer);
      sessionStorage.removeItem("idReport");
      sessionStorage.removeItem("time");
      sessionStorage.removeItem("answers");

      isFinish.value = true;

      if (question.value.answerType === 0) {
        if (answerInput.value) {
          toggleAnswer(answerInput.value);
        }
      }

      answerInput.value = null;
      await sendAnswer();

      let response = await closeReport({
        reviewId: idReport.value,
        examid: exam.value.id,
        userId: currentUser.value.id,
      });

      if (response && response.value) {
        if (response.value.status === 200) {
          console.log("END ***************************************");

          sessionStorage.removeItem("idReport");
          router.push({
            name: "ExamResult",
            params: { idReport: idReport.value },
          });
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    /**
     * Start time for exam
     */
    const startTimer = () => {
      timer = setInterval(() => {
        seconds.value--;

        if (seconds.value <= 0 && minutes.value <= 0) {
          clearTimeout(timer);
          isFinish.value = true;
          finishExam();
          return;
        }

        if (seconds.value < 0) {
          if (minutes.value - 1 >= -1) {
            minutes.value--;
            seconds.value = 59;
          }
        }

        sessionStorage.time = JSON.stringify({
          minutes: minutes.value,
          seconds: seconds.value,
        });
      }, 1000);
    };

    /**
     * Next quesiton
     */
    const nextQuestion = () => {
      if (currentQuestion.value  < questions.value.length) {
        changeQuestion(currentQuestion.value + 1);
      }
    };

    /**
     * Prev question
     */
    const prevQuestion = () => {
      if (currentQuestion.value - 1 >= 1) {
        changeQuestion(currentQuestion.value - 1);
      }
    };

    const questionsItems = computed(() => {
      if (questions.value) {
        questions.value.sort((x1, x2) => x1?.id - x2?.id);
        question.value = questions.value[currentQuestion.value - 1];

        pagination.value = paginate(
          questions.value.length,
          currentQuestion.value,
          1
        );
      }

      return questions.value;
    });

    /**
     * First Question
     */
    const firstHandle = () => {
      changeQuestion(1);
    };

    /**
     * Last questin
     */
    const lastHandle = () => {
      changeQuestion(pagination.value.totalPages);
    };

    return {
      isFinish,
      idReport,
      pagination,
      exam,
      question,
      questions,
      questionsItems,
      currentQuestion,
      changeQuestion,
      userAnswers,
      toggleAnswer,
      answerInput,
      finishExam,
      minutes,
      seconds,
       nextQuestion,
       prevQuestion,
      firstHandle,
      lastHandle,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");

html {
  position: relative;
  min-height: 100%;
}

body {
  margin-bottom: 100px;
}

.pagination ul {
  /* width: 100%; */
  display: flex;
  flex-wrap: wrap;
  /* background: #fff; */
  padding: 8px;
  border-radius: 50px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
}
.pagination ul li {
  color: #20b2aa;
  list-style: none;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}
.pagination ul li.numb {
  list-style: none;
  height: 45px;
  width: 45px;
  margin: 0 3px;
  line-height: 45px;
  border-radius: 50%;
}
.pagination ul li.numb.first {
  margin: 0px 3px 0 -5px;
}
.pagination ul li.numb.last {
  margin: 0px -5px 0 3px;
}
.pagination ul li.dots {
  font-size: 22px;
  cursor: default;
}
.pagination ul li.btn {
  padding: 0 20px;
  border-radius: 50px;
}
.pagination li.active,
.pagination ul li.numb:hover,
.pagination ul li:first-child:hover,
.pagination ul li:last-child:hover {
  color: #fff !important;
  background: #20b2aa !important;
}
</style>