<template>
  <router-link :to="{ name: 'QuestionsList' }" class="btn btn-outline-info">
    <i><font-awesome-icon icon="circle-arrow-left" /></i>
  </router-link>
  <div class="p-5">
    <hr class="text-secondary" />

    <div v-if="question && category && answers">
      <form @submit.prevent="submitHandle">
        <div class="row">
          <div class="col-md-12">
            <div class="mb-3" v-if="category">
              <label class="labels c-label">Category</label>
              <input
                class="form-control bg-transparent c-input"
                readonly
                type="text"
                :value="category.name"
              />
            </div>
          </div>
          <div class="col-md-12">
            <div class="mb-3">
              <label class="labels c-label">Context</label>
              <textarea
                class="form-control bg-dark c-input"
                style="overflow: hidden"
                placeholder="enter context"
                v-model.trim="question.context"
              ></textarea>
            </div>
          </div>
          <div class="col-md-12">
            <div class="mb-3">
              <label class="labels c-label">Type of Answer</label>
              <select
                class="form-select bg-transparent text-white c-input"
                aria-label="Default select example"
                v-model="typeAnswer"
              >
                <option
                  class="text-dark"
                  v-for="at in answerTypes"
                  :key="at.value"
                  :value="at.value"
                >
                  {{ at.title }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <button class="btn btn-outline-light" :disabled="loading" type="submit">
          Update
        </button>
        <button class="btn btn-outline-danger mx-2" :disabled="loading" @click.prevent="deleteHandle">Delete</button>
      </form>
      <hr class="text-info" />
      <div class="col-md-12 mt-5">
        <label class="labels c-label">Answer</label>
        <textarea
          class="form-control bg-dark c-input"
          style="overflow: hidden"
          placeholder="enter answer"
          v-model.trim="answer"
        ></textarea>
      </div>

      <div class="col-md-12 mt-3" v-if="question.answerType !== 0">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="isCorrectAnswer"
        />
        <label
          class="form-check-label mx-3 c-label"
          for="flexCheckChecked"
          @click="isCorrectAnswer = !isCorrectAnswer"
        >
          Is corect asnwer
        </label>
      </div>

      <div class="mt-3">
        <button
          class="btn btn-outline-light"
          @click.prevent="addAnswerHandle"
          v-if="!isMaxAnswers"
          :disabled="loading"
        >
          Add Answer
        </button>
        <button
          v-if="updateAnswerStatus"
          class="btn btn-outline-warning mx-2"
          @click.prevent="updateAnswerHandle"
          :disabled="loading"
        >
          Update Answer
        </button>
      </div>
      <hr class="text-info" />
      <div class="mt-3">
        <label class="labels c-label">Answers</label>
        <div v-if="isTextAnswer" class="text-danger m-3">
          <span><i class="fa-solid fa-circle-exclamation fs-3"></i> </span>
          <span class="mx-3">Must be only one answer</span>
        </div>
        <div v-if="isKeysWords" class="text-info m-3">
          <span>
            <i class="fs-3">
              <font-awesome-icon icon="circle-exclamation" />
            </i>
          </span>
          <span class="mx-3">Must be KeysWords</span>
        </div>
        <div
          class="text-danger m-3"
          v-if="
            answers.length > 0 &&
            answers.filter((x) => x.isCorrectAnswer).length === 0
          "
        >
          <span>
            <i class="fs-3">
              <font-awesome-icon icon="circle-exclamation" />
            </i>
          </span>
          <span class="mx-3">Don't have a correct answer!!</span>
        </div>
        <div v-if="isOneAnswer" class="text-danger m-3">
          <span>
            <i class="fs-3">
              <font-awesome-icon icon="circle-exclamation" />
            </i>
          </span>
          <span class="mx-3">Must be only one correct answer</span>
        </div>
        <div v-if="isMultyAnswers" class="text-danger m-3">
          <span>
            <i class="fs-3">
              <font-awesome-icon icon="circle-exclamation" />
            </i>
          </span>
          <span class="mx-2">Must be more than one correct answer</span>
        </div>
        <ul style="list-style-type: none">
          <li v-for="(ans, index) in answers" :key="ans">
            <div class="d-flex">
              <div>
                <button
                  @click="removeAnswerHandle(index)"
                  class="btn btn-outline-light icon-op"
                  :disabled="loading"
                >
                  <font-awesome-icon icon="trash-can" />
                </button>
              </div>
              <div>
                <button
                  class="btn btn-outline-light icon-op"
                  :disabled="loading"
                  @click="editAnswerHandle(index)"
                >
                  <font-awesome-icon icon="pen-to-square" />
                </button>
              </div>
              <div
                :class="{
                  'text-info': ans.isCorrectAnswer,
                  'text-warning': !ans.isCorrectAnswer,
                }"
              >
                <span class="c-answer p-2"> {{ ans.charKey }}</span>
                <span class="m-2"> {{ ans.context }} </span>
              </div>
            </div>
            <hr class="text-info" />
          </li>
        </ul>
      </div>
      <hr class="text-secondary" />
    </div>
    <div class="d-flex justify-content-center" v-else>
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
import { ref, getCurrentInstance, onMounted } from "vue";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import answerService from "@/_services/answerService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { useRouter } from 'vue-router';
export default {
  props: ["id"],

  setup(props) {
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const router = useRouter();

    const category = ref(null);
    const question = ref(null);
    const answer = ref(null);
    const answers = ref([]);
    const updateAnswerStatus = ref(false);
    
    const indexUpdate = ref(null);
    const isCorrectAnswer = ref(false);
    const typeAnswer = ref(null);
    
    const isMultyAnswers = ref(false);
    const isOneAnswer = ref(false);
    const isTextAnswer = ref(false);
    const isMaxAnswers = ref(false);
    const isKeysWords = ref(false);
    
    var code = 65;
    const answerTypes = ref([
      { title: "Text", value: 0 },
      { title: "Single", value: 1 },
      { title: "Multiple", value: 2 },
    ]);

    const { getCategoryById } = categoryService();
    const { getQuestionById, updateQuestion, removeQuestion } = questionService();
    const { getQuestionAnswers, updateAnswer, removeAnswer, createAnswer } =
      answerService();

    onMounted(async () => {
      let responseQ = await getQuestionById(props.id);

      if (responseQ && responseQ.value) {
        if (responseQ.value.status === 200) {
          question.value = responseQ.value.data;
          typeAnswer.value = question.value.answerType;

          checkAnswers();
        } else {
          handleResponse(responseQ.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      if (question.value) {
        let response = await getCategoryById(question.value.questionCategoryId);

        if (response && response.value) {
          if (response.value.status === 200) {
            category.value = response.value.data;
          } else {
            handleResponse(response.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }

        await getAnswersQuestion();
      }
    });

    /**
     * Gets answer of question
     */
    const getAnswersQuestion = async () => {
      let responseA = await getQuestionAnswers(question.value.id);

      if (responseA && responseA.value) {
        if (responseA.value.status === 200) {
          answers.value = responseA.value.data.sort((x1, x2) =>
            x1.charKey?.localeCompare(x2.charKey)
          );
          checkAnswers();
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
     * Deletes answer from quesion
     */
    const removeAnswerHandle = async (index) => {
      loading.value = true;
      let response = await removeAnswer(answers.value[index].id);

      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Answer removed successfully");

          answers.value.splice(index, 1);

          if(answers.value.length === 0) {
           isMaxAnswers.value = false;
          }

          console.log(answers.value);
          if (answers.value.length !== 0) {
           let i = 0;
            for (const iterator of answers.value) {
              iterator.charKey = String.fromCharCode(code + i);

                console.log(iterator.charKey );
                ++i;
              let res = await updateAnswer(iterator.id, iterator);

              if (res && res.value) {
                if (res.value.status === 204) {
                } else {
                  handleResponse(res.value).forEach((element) => {
                    toast.error(element, {
                      position: "top",
                      duration: 3000,
                    });
                  });
                }
              }
            }

            checkAnswers();
          }
        } else {
          handleResponse(response.value).forEach((el) => {
            toast.error(el, {
              position: "top",
              duration: 3000,
            });
          });
        }
      }
    };

    /**
     * Add new answer to question
     */
    const addAnswerHandle = async () => {
      if (!answer.value) {
        toast.error("Answer field is required");
        return;
      }

      if (answer.value.length > 400 || answer.value.length < 3) {
        toast.error(
          "Answer context can't be longer than 400 characters and can't be less 3 characters"
        );
        return;
      }

      loading.value = true;
      let response = await createAnswer({
        context: answer.value,
        questionItemId: props.id,
        charKey:
          question.value.answerType === 0
            ? "T"
            : String.fromCharCode(code + answers.value.length),
        isCorrectAnswer:
          question.value.answerType === 0 ? true : isCorrectAnswer.value,
      });

      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 201) {
          toast.success("Answer created successfully");
          answers.value.push(response.value.data);

          answer.value = null;
          isCorrectAnswer.value = false;
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 3000,
            });
          });
        }
      }

      checkAnswers();
    };

    /**
     * Sets data for update
     */
    const editAnswerHandle = (index) => {
      updateAnswerStatus.value = true;
      answer.value = answers.value[index].context;
      isCorrectAnswer.value = answers.value[index].isCorrectAnswer;

      indexUpdate.value = index;
    };

    /**
     * Updates answers
     */
    const updateAnswerHandle = async () => {
      if (answer.value.length > 400 || answer.value.length < 3) {
        toast.error(
          "Answer context can't be longer than 400 characters and can't be less 3 characters"
        );
        return;
      }

      let response = await updateAnswer(answers.value[indexUpdate.value].id, {
        context: answer.value,
        isCorrectAnswer: isCorrectAnswer.value,
        charKey: answers.value[indexUpdate.value].charKey,
        questionItemId: props.id,
      });

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Answer updated successfully");
          answers.value[indexUpdate.value].context = answer.value;
          answers.value[indexUpdate.value].isCorrectAnswer =
            isCorrectAnswer.value;
          answers.value[indexUpdate.value].charKey =
            answers.value[indexUpdate.value].charKey;

          checkAnswers();
          indexUpdate.value = null;
          updateAnswerStatus.value = false;
          answer.value = null;
          isCorrectAnswer.value = false;
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 3000,
            });
          });
        }
      }
    };

    const submitHandle = async () => {
      indexUpdate.value = null;
      updateAnswerStatus.value = false;
      answer.value = null;
      isCorrectAnswer.value = false;

      if (!question.value.context) {
        toast.error("Context is required");
        return;
      }

      if (
        question.value.context.length > 400 ||
        question.value.context.length < 3
      ) {
        toast.error(
          "Question context can't be longer than 400 characters and can't be less 3 characters"
        );
        return;
      }

      if (typeAnswer.value === null) {
        toast.error("Type of answer is required");
        return;
      }

      loading.value = true;

      console.log(typeAnswer.value);
      let response = await updateQuestion(question.value.id, {
        context: question.value.context,
        answerType: typeAnswer.value,
        questionCategoryId: question.value.questionCategoryId,
      });

      loading.value = false;
      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("The question updated successfully");
          question.value.answerType = typeAnswer.value;

          console.log(question.value);
          await getAnswersQuestion();
          checkAnswers();
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 3000,
            });
          });
        }
      }

      loading.value = false;
    };

    const checkAnswers = () => {
      isOneAnswer.value = false;
      isMultyAnswers.value = false;
      isTextAnswer.value = false;
      isKeysWords.value = false;

      if (question.value) {
        if (question.value.answerType === 0) {
          isMaxAnswers.value = answers.value.length >= 1 ? true : false;
          isTextAnswer.value = answers.value.length > 1 ? true : false;
          isKeysWords.value = true;
        }

        if (question.value.answerType === 1) {
          if (answers.value.filter((x) => x.isCorrectAnswer).length > 1) {
            isOneAnswer.value = true;
          } else {
            isOneAnswer.value = false;
          }
        }

        if (question.value.answerType === 2) {
          if (answers.value.filter((x) => x.isCorrectAnswer).length <= 1) {
            isMultyAnswers.value = true;
          } else {
            isMultyAnswers.value = false;
          }
        }

        if (question.value.answerType === 0) {
          isMaxAnswers.value = answers.value.length >= 1 ? true : false;
        }
        if (
          question.value.answerType === 1 ||
          question.value.answerType === 2
        ) {
          isMaxAnswers.value = answers.value.length >= 5 ? true : false;
        }
      }
    };

    const deleteHandle = async() => {
      loading.value = true;
      let response = await removeQuestion(props.id);

      if(response && response.value ){
        if(response.value.status === 204) {
          toast.success("The question removed successfully!");
          router.push({name: 'QuestionsList'});
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

    }

    return {
      loading,
      category,
      isMultyAnswers,
      isOneAnswer,
      question,
      answer,
      isCorrectAnswer,
      isTextAnswer,
      isKeysWords,
      isMaxAnswers,
      answers,
      typeAnswer,
      answerTypes,
      updateAnswerStatus,
      removeAnswerHandle,
      addAnswerHandle,
      editAnswerHandle,
      updateAnswerHandle,
      submitHandle,
      deleteHandle
    };
  },
};
</script>

<style scopped>
.c-answer {
  display: inline-block;
  width: max-content;
  border: 2px solid white;
  border-radius: 50%;
}
.icon-op {
  cursor: pointer;
  margin-right: 10px;
  color: #fff;
}
</style>