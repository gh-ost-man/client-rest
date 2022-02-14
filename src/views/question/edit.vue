<template>
  <div class="p-5 text-white">
    <h3 class="text-white">Edit Question and asnwers</h3>
    <hr class="text-secondary" />
    <div v-if="error">
      <textarea
        class="form-control bg-dark text-secondary border-0"
        style="overflow: hidden"
        cols="30"
        rows="15"
        :value="error"
        readonly
      ></textarea>
    </div>
    <form @submit.prevent="submitHandle" v-if="question && category && answers">
      <div class="row">
        <div class="col-md-12">
          <div class="mb-3" v-if="category">
            <label class="labels">Category</label>
            <input
              class="form-control bg-transparent text-white"
              readonly
              type="text"
              :value="category.name"
            />
          </div>
        </div>
        <div class="col-md-12">
          <div class="mb-3">
            <label class="labels">Context</label>
            <textarea
              class="form-control bg-dark text-white border-0"
              style="overflow: hidden"
              placeholder="enter context"
              v-model="question.context"
            ></textarea>
          </div>
        </div>
        <hr class="text-secondary" />
        <div class="col-md-12 mt-5">
          <label class="labels">Answer</label>
          <textarea
            class="form-control bg-dark text-white border-0"
            style="overflow: hidden"
            placeholder="enter answer"
            v-model="answer"
          ></textarea>
        </div>
        <div class="col-md-12 mt-2">
          <label class="labels">Coeficient</label
          ><input
            type="number"
            step="0.01"
            min="0"
            max="1"
            class="form-control bg-transparent text-white"
            placeholder="enter coeficient"
            v-model="coeficient"
          />
        </div>
      </div>

      <div class="mt-3">
        <button class="btn btn-outline-light" @click.prevent="addAnswerHandle">
          Add Answer
        </button>
        <button
          v-if="updateAnswerStatus"
          class="btn btn-outline-warning"
          @click.prevent="updateAnswerHandle"
        >
          Update Answer
        </button>
      </div>
      <div class="mt-3">
        <label for="labels">Answers</label>
        <ul style="list-style-type: none">
          <li v-for="(ans, index) in answers" :key="ans">
            <div class="d-flex">
              <div>
                <i
                  @click="removeAnswerHandle(index)"
                  class="fa-solid fa-trash-can"
                  style="cursor: pointer; margin-right: 10px"
                ></i>
              </div>
              <div>
                <i
                  class="fa-solid fa-pen-to-square"
                  style="cursor: pointer; margin-right: 10px"
                  @click="editAnswerHandle(index)"
                ></i>
              </div>
              <div>{{ ans.context }} | {{ ans.correctAnswerCoefficient }}</div>
            </div>
          </li>
        </ul>
      </div>
      <hr class="text-secondary" />

      <button class="btn btn-outline-light" :disabled="loading" type="submit">
        <span v-if="!loading">Save changes</span>
        <span v-else>Saving...</span>
      </button>
      <button
        class="btn btn-outline-danger mx-2"
        :disabled="loading"
      >
        Delete questions
      </button>
    </form>
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
export default {
  props: ["id", "categoryId"],
  setup(props) {
    const error = ref(null);
    const loading = ref(false);
    const category = ref(null);
    const question = ref(null);
    const answer = ref(null);
    const coeficient = ref(null);
    const answers = ref([]);
    const asnwersForRemove = ref([]);
    const updateAnswerStatus = ref(false);
    const indexUpdate = ref(null);

    const toast = getCurrentInstance().appContext.app.$toast;

    const { getCategory } = categoryService();
    const { getQuestionById, updateQuestion } = questionService();
    const { getAnswerAll, updateAnswer, removeAnswer, createAnswer } =
      answerService();

    onMounted(async () => {
      let response = await getCategory(props.categoryId);

      if (response && response.value) {
        if (response.value.status === 200) {
          console.log(response.value.data);
          category.value = response.value.data;
        } else {
          error.value = JSON.stringify(
            handleResponse(response.value),
            undefined,
            2
          );
        }
      }

      if (category.value) {
        let responseQ = await getQuestionById(category.value.id, props.id);

        if (responseQ && responseQ.value) {
          if (responseQ.value.status === 200) {
            question.value = responseQ.value.data;
          } else {
            error.value = JSON.stringify(handleResponse(responseQ.value));
          }
        }
      }

      if (question.value) {
        let responseA = await getAnswerAll(props.categoryId, props.id);

        if (responseA && responseA.value) {
          if (responseA.value.status === 200) {
            answers.value = responseA.value.data;

            console.log(answers.value);
          } else {
            error.value = JSON.stringify(
              handleResponse(responseA),
              undefined,
              2
            );
          }
        }
      }
    });

    const removeAnswerHandle = (index) => {
      asnwersForRemove.value.push(answers.value[index]);
      answers.value.splice(index, 1);
    };

    const addAnswerHandle = () => {
      if (!answer.value) {
        toast.error("Answer field is required");
        return;
      }

      if (coeficient.value == null) {
        toast.error("Coeficient field is required");
        return;
      }

      answers.value.push({
        context: answer.value,
        correctAnswerCoefficient: coeficient.value,
        status: "Added",
      });

      answer.value = null;
      coeficient.value = null;
       indexUpdate.value = null;
      updateAnswerStatus.value = false;
    };

    const editAnswerHandle = (index) => {
      updateAnswerStatus.value = true;
      answer.value = answers.value[index].context;
      coeficient.value = answers.value[index].correctAnswerCoefficient;

      indexUpdate.value = index;
    };

    const updateAnswerHandle = () => {
      answers.value[indexUpdate.value].context = answer.value;
      answers.value[indexUpdate.value].correctAnswerCoefficient =
        coeficient.value;

      // answers.value[indexUpdate.value].status = "Modified";
      answers.value[indexUpdate.value].status = answers.value[indexUpdate.value]
        .id
        ? "Modified"
        : "Added";

      indexUpdate.value = null;
      updateAnswerStatus.value = false;
      answer.value = null;
      coeficient.value = null;
    };

    const submitHandle = async () => {
      // console.log("ANSWERS: ", answers.value);
      // console.log("REMOVE: ", asnwersForRemove.value);

      error.value = null;

      if (!question.value.context) {
        toast.error("Context is required");
        return;
      }

      if (answers.value.length < 2) {
        toast.error("The question must have minimum two answers");
        return;
      }

      loading.value = true;

      let response = await updateQuestion(
        category.value.id,
        question.value.id,
        { context: question.value.context }
      );

      if (response && response.value) {
        if (response.value.status === 204) {
          console.log("QUESTION UPDATE SUCCESS");
          if (!asnwersForRemove.value.length) {
            asnwersForRemove.value.forEach(async (element) => {
              await removeAnswer(
                category.value.id,
                question.value.id,
                element.id
              );
            });

            console.log("ANSWER REMOVED SUCCESS");

            asnwersForRemove.value = [];
          }

          let addedAnswers = answers.value.filter((x) => x.status === "Added");

          if (addedAnswers && addedAnswers.length > 0) {
            addedAnswers.forEach(async (element) => {
              await createAnswer(category.value.id, question.value.id, {
                context: element.context,
                correctAnswerCoefficient: element.correctAnswerCoefficient,
              });
            });

            console.log("ANSWERSADDED SUCCESS");
          }

          let updatedAnswers = answers.value.filter(
            (x) => x.status === "Modified"
          );

          if (updatedAnswers && updatedAnswers.length > 0) {
            updatedAnswers.forEach(async (element) => {
              await updateAnswer(
                category.value.id,
                question.value.id,
                element.id,
                {
                  context: element.context,
                  correctAnswerCoefficient: element.correctAnswerCoefficient,
                }
              );
            });

            console.log("ANSWERRUPDATE SUCCESS");
          }
        } else {
          error.value = JSON.stringify(
            handleResponse(response.value),
            undefined,
            2
          );
        }
      }

      loading.value = false;
    };

    return {
      error,
      loading,
      category,
      question,
      answer,
      answers,
      updateAnswerStatus,
      coeficient,
      removeAnswerHandle,
      addAnswerHandle,
      editAnswerHandle,
      updateAnswerHandle,
      submitHandle,
    };
  },
};
</script>

<style>
</style>