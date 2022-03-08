<template>
  <div class="p-3" v-if="exam">
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
          <span> {{ question.id }}</span>
          <span> {{ question.context }}</span>
        </h4>
      </div>
      <div>
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
      <div class="d-flex justify-content-center fixed-bottom">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <button class="page-link" @click="prevQuestion">Previous</button>
            </li>
            <li
              class="page-item"
              :class="{
                active: currentQuestion === index,
                'bg-success':
                  userAnswers?.filter((x) => x.idQuesiton === q.id).length > 0,
              }"
              @click="changeQuestion(index)"
              v-for="(q, index) in questions"
              :key="q.id"
            >
              <button
                class="page-link"
                :disabled="isFinish"
                :class="{
                  'bg-success':
                    userAnswers?.filter((x) => x.idQuesiton === q.id).length >
                    0,
                }"
              >
                {{ index + 1 }}
                {{ q.id }}
              </button>
            </li>
            <li class="page-item"><button class="page-link" @click="nextQuestion">Next</button></li>
            <li class="page-item">
              <button class="page-link bg-info" @click="finishExam">
                Finish
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div class="text-white">{{ userAnswers }}</div>
    </div>
    <div class="d-flex justify-content-center" v-if="!exam || !question">
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
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import questionService from "@/_services/questionService.js";
import answerService from "@/_services/answerService.js";
import authService from "@/_services/authService.js";
import userService from "@/_services/userService.js";
import { onMounted, ref, computed, getCurrentInstance, onUnmounted } from "vue";
import reportService from "@/_services/reportService.js";
import { useRouter } from "vue-router";
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
    const { createReport, reportAction } = reportService();
    const { getExamById, getAllExamQuestions } = examService();
    const { getQuestionById } = questionService();
    const { getQuestionAnswers } = answerService();
    const { removeExamFromUser, getUserExams } = userService();

    const exam = ref(null);
    const examQuestions = ref(null);
    const questions = ref(null);
    const question = ref(null);
    const currentQuestion = ref(0);
    const answerInput = ref(null);

    const userAnswers = ref([]);

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

      //Get exam data
      let response = await getExamById(props.idExam);
      if (response && response.value) {
        if (response.value.status === 200) {
          exam.value = response.value.data;
          // minutes.value = response.value.data.passingScore;
          minutes.value = 1;
          seconds.value = 10;

          //Get exam questions
          let res = await getAllExamQuestions(props.idExam);

          if (res && res.value) {
            if (res.value.status === 200) {
              examQuestions.value = res.value.data.items;
              questions.value = [];
              //Get question data
              await examQuestions.value.reduce(async (a, el) => {
                let resQ = await getQuestionById(el.questionItemId);
                if (resQ && resQ.value) {
                  if (resQ.value.status === 200) {
                    let item = resQ.value.data;
                    //Get answers of question
                    let resA = await getQuestionAnswers(item.id);

                    if (resA && resA.value) {
                      if (resA.value.status === 200) {
                        item.answers = resA.value.data;
                        questions.value.push({
                          ...item,
                          answers: resA.value.data,
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
              }, Promise.resolve());

              // startTimer();
            } else {
              handleResponse(res.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
            }
          }

          question.value = questions.value[0];
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
      clearTimeout(timer);
    });
    /**
     * Changes question
     */
    const changeQuestion = async (index) => {
      if (currentQuestion.value === index) return;

      if (question.value?.answerType === 0) {
        if (answerInput.value||answerInput.value==='') {
          toggleAnswer(answerInput.value);
        }
      }

      await sendAnswer();

      currentQuestion.value = index;
      question.value = questions.value[index];
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

    //Text   -> 104, 107 110
    //Single -> 105  108 111 113
    //Multy  -> 106  109 112

    /**
     * Sends answer into db
     */
    const sendAnswer = async () => {
      let obj = userAnswers.value.find(
        (x) => x.idQuesiton === question.value.id
      );

      if (obj && (obj.status === "New" || obj.status === "Modify")) {
        let response = await createReport({
          examId: exam.value.id,
          applicantId: currentUser.value.id,
          questionId: question.value.id,
          currentKeys: obj.answers.join(","),
        });

        if (response && response.value) {
          if (response.value.status === 200) {
            obj.status = "Added";
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
            userAnswers.value.splice(0, 1);

            let item = {};
            item.idQuesiton = question.value.id;
            item.answers = [answerInput.value];
            userAnswers.value.push(item);

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
      console.log(questions.value.length);
      console.log(userAnswers.value.length);

      isFinish.value = true;

      console.log(exam.value);
      console.log(currentUser.value);

      if (question.value.answerType === 0) {
        if (answerInput.value) {
          toggleAnswer(answerInput.value);
        }
      }

      answerInput.value = null;
      await sendAnswer();

      let response = await reportAction({
        examid: exam.value.id,
        userId: currentUser.value.id,
      });

      if (response && response.value) {
        if (response.value.status === 200) {
          console.log("END ***************************************");

          let res = await removeExamFromUser({
            userId: currentUser.value.id,
            examId: props.idExam,
          });

          if (res && res.value) {
            if (res.value.status !== 200) {
              handleResponse(res.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
            }
          }

          router.push({ name: "ExamResult", params: { idReport: 1 } });
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
      }, 1000);
    };

    const nextQuestion = () => {
      if((currentQuestion.value + 1) < questions.value.length) {
        changeQuestion(currentQuestion.value + 1)
      }
    }

    const prevQuestion = () => {
       if((currentQuestion.value - 1 )>= 0) {
        changeQuestion(currentQuestion.value -1  )
      }
    }

    return {
      isFinish,
      exam,
      question,
      questions,
      currentQuestion,
      changeQuestion,
      userAnswers,
      toggleAnswer,
      answerInput,
      finishExam,
      minutes,
      seconds,
      nextQuestion,
      prevQuestion
    };
  },
};
</script>

<style>
</style>