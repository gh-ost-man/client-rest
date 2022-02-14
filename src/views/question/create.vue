<template>
  <div class="p-5 text-white">
    <h3 class="text-white">Create Question and asnwer</h3>
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
    <form @submit.prevent="submitHandle">
      <div class="row">
        <div class="col-md-12">
          <div class="mb-3">
            <label class="labels">Category</label>
            <select
              class="form-select bg-transparent text-white"
              aria-label="Default select example"
              v-model="categoryId"
            >
              <option
                class="text-dark"
                v-for="c in categories"
                :key="c.id"
                :value="c.id"
              >
                {{ c.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-12">
          <div class="mb-3">
            <label class="labels">Context</label>
            <textarea
              class="form-control bg-dark text-white border-0"
              style="overflow: hidden"
              placeholder="enter context"
              v-model="context"
            ></textarea>
            <!-- <input
              type="text"
              class="form-control bg-transparent text-white"
              placeholder="enter context"
              v-model="context"
            /> -->
          </div>
        </div>
        <hr class="text-secondary" />
        <div class="col-md-12 mt-5">
          <label class="labels">Answers</label>
          <textarea
            class="form-control bg-dark text-white border-0"
            style="overflow: hidden"
            placeholder="enter answer"
            v-model="answer"
          ></textarea>
          <!-- <input
          type="text"
          class="form-control bg-transparent text-white"
          placeholder="enter answer"
          v-model="answer"
        /> -->
        </div>
        <div class="col-md-12 mt-5">
          <label class="labels">Coeficient</label
          ><input
            type="number"
            step="0.1"
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
      </div>
      <div class="mt-3">
        <ul style="list-style-type: none;">
          <li v-for="(ans, index) in answers" :key="ans">
            <div class="d-flex ">
              <div><i @click="removeAnswer(index)" class="fa-solid fa-trash-can"  style="cursor:pointer; margin-right: 10px"></i></div>
              <div>{{ ans.context }} | {{ ans.CorrectAnswerCoefficient }}</div>
            </div>
          </li>
        </ul>
      </div>
      <hr class="text-secondary" />

      <button class="btn btn-outline-light" :disabled="loading" type="submit">
        <span v-if="!loading">Create</span>
        <span v-else>Creating...</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import answerService from "@/_services/answerService.js";
import handleResponse from "@/_helpers/handleResponse.js";
export default {
  setup() {
    const error = ref(null);
    const loading = ref(false);
    const categoryId = ref(null);
    const categories = ref(null);
    const context = ref(null);
    const answer = ref(null);
    const coeficient = ref(null);
    const answers = ref([]);

    const toast = getCurrentInstance().appContext.app.$toast;

    const { getAllCategories } = categoryService();
    const { createQuesiton } = questionService();
    const { createAnswer } = answerService();

    onMounted(async () => {
      let respose = await getAllCategories();

      if (respose && respose.value) {
        if (respose.value.status === 200) {
          categories.value = respose.value.data;
        }
      }
    });

    const submitHandle = async () => {
      error.value = null;

      if (!categoryId.value) {
        toast.error("Category is required");
        return;
      }

      if (!context.value) {
        toast.error("Context is required");
        return;
      }

      if (answers.value.length < 2) {
        toast.error("The question must have minimum two answers");
        return;
      }

      loading.value = true;

      let response = await createQuesiton(categoryId.value, {
        context: context.value,
      });

      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 201) {
          toast.success("The question created successfully");

          loading.value = true;

          answers.value.forEach(async (element) => {
            await createAnswer(
              categoryId.value,
              response.value.data.id,
              element
            );
          });
          context.value = null;
          categoryId.value = null;
          answers.value = [];

          loading.value = false;
        } else {
          toast.error("Some errors");
          error.value = JSON.stringify(
            handleResponse(response.value),
            undefined,
            2
          );
        }
      }
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
        CorrectAnswerCoefficient: coeficient.value,
      });

      answer.value = null;
      coeficient.value = null;
    };

    const removeAnswer = (index)=> {
      answers.value.splice(index,1);
    }
    return {
      error,
      categories,
      categoryId,
      coeficient,
      answer,
      answers,
      context,
      loading,
      submitHandle,
      addAnswerHandle,
      removeAnswer,
    };
  },
};
</script>

<style>
</style>