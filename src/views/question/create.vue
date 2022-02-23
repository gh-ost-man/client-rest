<template>
  <router-link :to="{ name: 'QuestionsList' }" class="btn btn-outline-info">
  <i><font-awesome-icon icon="circle-arrow-left" /></i>  
  </router-link>
  <div class="p-5 text-white">
    <h3 class="text-white c-title">Question</h3>
    <hr class="text-info" />
    <form @submit.prevent="submitHandle">
      <div class="row">
        <div class="col-md-12">
          <div class="mb-3">
            <label class="labels c-label">Category</label>
            <select
              class="form-select bg-transparent text-white c-input"
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
            <label class="labels c-label">Context</label>
            <textarea
              class="form-control bg-dark c-input"
              style="overflow: hidden"
              placeholder="enter context"
              v-model.trim="context"
            ></textarea>
            <!-- <input
              type="text"
              class="form-control bg-transparent text-white"
              placeholder="enter context"
              v-model="context"
            /> -->
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
      <button class="btn btn-outline-info" :disabled="loading" type="submit">
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
import { useRouter } from "vue-router";
export default {
  setup() {
    // const error = ref(null);
    const loading = ref(false);
    const categoryId = ref(null);
    const categories = ref(null);
    const context = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;
    const router = useRouter();
    const typeAnswer = ref(null);
    const answerTypes = ref([
      { title: "Text", value: 0 },
      { title: "Single", value: 1 },
      { title: "Multiple", value: 2 },
    ]);

    const { getAllCategories } = categoryService();
    const { createQuesiton } = questionService();

    onMounted(async () => {
      let respose = await getAllCategories();

      if (respose && respose.value) {
        if (respose.value.status === 200) {
          categories.value = respose.value.data;
        }
      }
    });

    const submitHandle = async () => {
      if (!categoryId.value) {
        toast.error("Category is required");
        return;
      }

      if (!context.value) {
        toast.error("Context is required");
        return;
      }
      if (context.value.length > 400 || context.value.length < 3) {
        toast.error(
          "Question context can't be longer than 400 characters and can't be less 3 characters"
        );
        return;
      }

      if (typeAnswer.value===null) {
        toast.error("Type of answer is required");
        return;
      }
      loading.value = true; 


      let response = await createQuesiton(categoryId.value, {
        context: context.value,
        answerType: typeAnswer.value

      });


      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 201) {
          toast.success("The question created successfully");
          context.value = null;

          router.push({
            name: "EditQuestion",
            params: {
              id: response.value.data.id,
              categoryId: categoryId.value,
            },
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

    return {
      categories,
      categoryId,
      context,
      loading,
      typeAnswer,
      answerTypes,
      submitHandle,
    };
  },
};
</script>

<style>
</style>