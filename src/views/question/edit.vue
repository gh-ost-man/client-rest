<template>
<router-link :to="{name:'QuestionsList'}" class="btn btn-outline-info"><i class="fa-solid fa-circle-arrow-left"></i></router-link>
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
                v-model="question.context"
              ></textarea>
            </div>
          </div>
        </div>
        <button class="btn btn-outline-light" :disabled="loading" type="submit">
          Update
        </button>
        <button class="btn btn-outline-danger mx-2" :disabled="loading">
          Delete questions
        </button>
      </form>
      <hr class="text-info" />
      <div class="col-md-12 mt-5">
        <label class="labels c-label">Answer</label>
        <textarea
          class="form-control bg-dark c-input"
          style="overflow: hidden"
          placeholder="enter answer"
          v-model="answer"
        ></textarea>
      </div>

      <div class="col-md-12 mt-3">
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
        <button class="btn btn-outline-light" @click.prevent="addAnswerHandle">
          Add Answer
        </button>
        <button
          v-if="updateAnswerStatus"
          class="btn btn-outline-warning mx-2"
          @click.prevent="updateAnswerHandle"
        >
          Update Answer
        </button>
      </div>
      <hr class="text-info" />
      <div class="mt-3">
        <label class="labels c-label">Answers</label>

        <div
          class="text-danger m-3"
          v-if="
            answers.length > 0 &&
            answers.filter((x) => x.isCorrectAnswer).length === 0
          "
        >
          <span><i class="fa-solid fa-circle-exclamation fs-3"></i> </span>
          <span class="mx-3">Don't have a correct answer!!</span>
        </div>
        <ul style="list-style-type: none">
          <li v-for="(ans, index) in answers" :key="ans">
            <div class="d-flex">
              <div>
                <i
                  @click="removeAnswerHandle(index)"
                  class="fa-solid fa-trash-can icon-op"
                ></i>
              </div>
              <div>
                <i
                  class="fa-solid fa-pen-to-square icon-op"
                  @click="editAnswerHandle(index)"
                ></i>
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
import {
  ref,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
} from "vue";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import answerService from "@/_services/answerService.js";
import handleResponse from "@/_helpers/handleResponse.js";
export default {
  props: ["id", "categoryId"],

  setup(props) {
    const loading = ref(false);
    const category = ref(null);
    const question = ref(null);
    const answer = ref(null);
    const answers = ref([]);
    const updateAnswerStatus = ref(false);
    const indexUpdate = ref(null);
    const isCorrectAnswer = ref(false);
    var code = 65;
    const toast = getCurrentInstance().appContext.app.$toast;

    const { getCategory } = categoryService();
    const { getQuestionById, updateQuestion } = questionService();
    const { getAnswerAll, updateAnswer, removeAnswer, createAnswer } =
      answerService();

    onMounted(async () => {
      let response = await getCategory(props.categoryId);

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

      if (category.value) {
        let responseQ = await getQuestionById(category.value.id, props.id);

        if (responseQ && responseQ.value) {
          if (responseQ.value.status === 200) {
            question.value = responseQ.value.data;
          } else {
          
            handleResponse(responseQ.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }

      if (question.value) {
        let responseA = await getAnswerAll(props.categoryId, props.id);

        if (responseA && responseA.value) {
          if (responseA.value.status === 200) {
            answers.value = responseA.value.data.sort((x1, x2) =>
              x1.charKey?.localeCompare(x2.charKey)
            );
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
    });

    const removeAnswerHandle = async (index) => {
      let response = await removeAnswer(
        props.categoryId,
        props.id,
        answers.value[index].id
      );

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Answer removed successfully");

          answers.value.splice(index, 1);

          answers.value.forEach((element, index) => {
            element.charKey = String.fromCharCode(code + index);
          });

          if (answers.value.length !== 0) {
            await answers.value.reduce(async (a, element) => {
              let res = await updateAnswer(
                props.categoryId,
                props.id,
                element.id,
                element
              );

              if (res && res.value) {
                if (res.value.status !== 204) {
                  handleResponse(res.value).forEach((element) => {
                    toast.error(element, {
                      position: "top",
                      duration: 3000,
                    });
                  });
                }
              }
            });
          }
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

      let response = await createAnswer(props.categoryId, props.id, {
        context: answer.value,
        charKey: String.fromCharCode(code + answers.value.length),
        isCorrectAnswer: isCorrectAnswer.value,
      });

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

      // if (coeficient.value == null) {
      //   toast.error("Coeficient field is required");
      //   return;
      // }

      // answers.value.push({
      //   context: answer.value,
      //   charKey: String.fromCharCode(code + answers.value.length).toUpperCase(),
      //   isCorrectAnswer: isCorrectAnswer.value,
      //   // correctAnswerCoefficient: coeficient.value,
      //   status: "Added",
      // });

      // answer.value = null;
      // // coeficient.value = null;
      // indexUpdate.value = null;
      // updateAnswerStatus.value = false;
    };

    const editAnswerHandle = (index) => {
      updateAnswerStatus.value = true;
      answer.value = answers.value[index].context;
      isCorrectAnswer.value = answers.value[index].isCorrectAnswer;

      indexUpdate.value = index;
    };

    const updateAnswerHandle = async () => {
      if (answer.value.length > 400 || answer.value.length < 3) {
        toast.error(
          "Answer context can't be longer than 400 characters and can't be less 3 characters"
        );
        return;
      }

      let response = await updateAnswer(
        props.categoryId,
        props.id,
        answers.value[indexUpdate.value].id,
        {
          context: answer.value,
          isCorrectAnswer: isCorrectAnswer.value,
          charKey: answers.value[indexUpdate.value].charKey,
        }
      );

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Answer updated successfully");
          answers.value[indexUpdate.value].context = answer.value;
          answers.value[indexUpdate.value].isCorrectAnswer =
            isCorrectAnswer.value;
          answers.value[indexUpdate.value].charKey =
            answers.value[indexUpdate.value].charKey;

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
    
      loading.value = true;

      let response = await updateQuestion(
        category.value.id,
        question.value.id,
        { context: question.value.context }
      );

      loading.value = false;
      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("The question updated successfully");
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


    return {
      loading,
      category,
      question,
      answer,
      isCorrectAnswer,
      answers,
      updateAnswerStatus,
      removeAnswerHandle,
      addAnswerHandle,
      editAnswerHandle,
      updateAnswerHandle,
      submitHandle,
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