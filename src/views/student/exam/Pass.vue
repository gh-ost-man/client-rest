<template>
  <div class="p-3" v-if="exam">
    <h1 class="text-white">Exam: {{ exam.title }}</h1>
    <div v-if="question">
      <div>
        <h4 class="text-white">
          <span> {{ question.context }}</span>
        </h4>
        <p class="text-white">{{ question.answerType }}</p>
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
              <a class="page-link" href="#">Previous</a>
            </li>
            <li
              class="page-item"
              :class="{
                active: currentQuestion === index,
                'bg-success':
                  userAnswers?.filter((x) => x.idQuesiton === q.id).length>0
              }"
              @click="changeQuestion(index)"
              v-for="(q, index) in questions"
              :key="q.id"
            >
              <button class="page-link" :class="{'bg-success':
                  userAnswers?.filter((x) => x.idQuesiton === q.id).length>0}">{{ index + 1 }}</button>
            </li>
            <li class="page-item"><a class="page-link" href="#">Next</a></li>
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
import { onMounted, ref, getCurrentInstance, computed } from "vue";
export default {
  props: ["id"],
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;

    const { getExamById, getAllExamQuestions } = examService();
    const { getQuestionById, updateQuestion } = questionService();
    const { getQuestionAnswers, updateAnswer, removeAnswer, createAnswer } =
      answerService();
    const exam = ref(null);
    const examQuestions = ref(null);
    const questions = ref(null);
    const question = ref(null);
    const currentQuestion = ref(1);
    const answerInput = ref(null);

    const userAnswers = ref([]);

    onMounted(async () => {
      let response = await getExamById(props.id);
      if (response && response.value) {
        if (response.value.status === 200) {
          exam.value = response.value.data;
          let res = await getAllExamQuestions(props.id);

          if (res && res.value) {
            if (res.value.status === 200) {
              examQuestions.value = res.value.data.items;

              questions.value = [];
              await examQuestions.value.reduce(async (a, el) => {
                let resQ = await getQuestionById(el.questionItemId);
                if (resQ && resQ.value) {
                  if (resQ.value.status === 200) {
                    let item = resQ.value.data;
                    let resA = await getQuestionAnswers(item.id);

                    if (resA && resA.value) {
                      if (resA.value.status === 200) {
                        item.answers = resA.value.data;
                        questions.value.push({
                          ...item,
                          answers: resA.value.data,
                        });
                        return;
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

    const changeQuestion = (index) => {

      console.log("Index: ", index);

      if(currentQuestion.value === index) return;

      if (question.value.answerType === 0) {
        if (answerInput.value) {
          toggleAnswer(answerInput.value);
        }
      }

      let obj = userAnswers.value.find(
        (x) => x.idQuesiton === question.value.id
      );
      if (obj) {
        obj.status = "Added";
      }

      currentQuestion.value = index;
      question.value = questions.value[index];
    };

    const answerInputHandle = (e) => {
      console.log(e.targer.value);
    };

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

              if(obj.answers.length === 0) {
                userAnswers.value =userAnswers.value.filter(x=>x.idQuesiton !== question.value.id); 
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

    return {
      exam,
      question,
      questions,
      currentQuestion,
      changeQuestion,
      userAnswers,
      toggleAnswer,
      answerInput,
      answerInputHandle,
    };
  },
};
</script>

<style>
</style>