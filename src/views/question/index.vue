<template>
  <div class="content">
    <div class="container">
      <div class="d-flex justify-content-between">
        <div> <h2 class="mb-5">Questions</h2></div>
        <div> 
          <router-link
          class="btn btn-outline-light"
          :to="{ name: 'CreateQuestion' }"
          >Create</router-link
        >
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="d-flex" v-if="questions">
        
        <div class="d-flex  text-center mx-4">
          <label  class="labels text-white w-auto fw-bolder mx-2"
            >Filter</label
          >
          <select
            class="form-select bg-transparent text-white"
            aria-label="Default select example"
            v-model="filterCategory"
          >
            <option disabled selected class="text-white">
              Select category
            </option>
            <option
              class="text-dark"
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <button class="btn btn-outline-light" @click="resetFilter">
            Reset
          </button>
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive" v-if="questions">
        <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          @changePage="changePage"
        ></paggination>
        <table class="table custom-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Context</th>
              <th scope="col">ReleaseDate</th>
              <th scope="col">Category</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="question in questionsItems" :key="question.id">
              <tr scope="row">
                <td>{{ question.id }}</td>
                <td>{{ question.context }}</td>
                <td>{{ new Date(question.releaseDate).toLocaleDateString() }}</td>
                <td>{{ question.category }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-light"
                    :to="{ name: 'EditQuestion', params: { id: question.id, categoryId: question.questionCategoryId} }"
                  >
                    <i class="fa-solid fa-pen-to-square icon"></i>
                  </router-link>
                </td>
              </tr>
              <tr class="spacer">
                <td colspan="100"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="!questions">
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
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { useRouter } from "vue-router";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Paggination from "@/components/Paggination";

export default {
  components: { Paggination },
  setup() {
    const error = ref(null);
    const ques = ref(null);
    const questions = ref(null);
    const categories = ref(null);
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getQuestions } = questionService();
    const { getAllCategories } = categoryService();
    const currentPage = ref(1);
    const pageSize = 15;
    const filterCategory = ref(null);

    const paggination = ref(null);

    onMounted(async () => {
      let response = await getAllCategories();

      if (response && response.value) {
        if (response.value.status === 200) {
          categories.value = response.value.data;
          questions.value = [];
          categories.value.forEach(async (cat) => {
            let res = await getQuestions(cat.id);

            if (res && res.value) {
              if (res.value.status === 200) {
                res.value.data.forEach((q) => {
                  questions.value.push({ ...q, category: cat.name });
                });
              }
            }
          });
          currentPage.value = 1;
          paggination.value = paginate(
            questions.value.length,
            currentPage.value,
            pageSize
          );
        } else {
          toast.error("Some errors");
          error.value = JSON.stringify(handleResponse(res.value), undefined, 2);
        }
      }
    });

    const resetFilter = () => {
      filterCategory.value = null;
      currentPage.value = 1;
    };

    const changePage = (pag) => {
      currentPage.value = pag;
    };

    const filterByCategory = computed(() => {
      currentPage.value = 1;
      return filterCategory.value
        ? questions.value.filter(
            (x) => x.questionCategoryId == filterCategory.value
          )
        : questions.value;
    });

    const questionsItems = computed(() => {
      paggination.value = paginate(
        filterByCategory.value.length,
        currentPage.value,
        pageSize
      );

      return filterByCategory.value.slice(
        paggination.value.startIndex,
        paggination.value.endIndex + 1
      );
    });

    return {
      categories,
      questions,
      error,
      questionsItems,
      currentPage,
      paggination,
      filterCategory,
      changePage,
      resetFilter,
    };
  },
};
</script>

<style scopped>
a:hover .icon {
  color: black !important;
}

.truncate-text {
  overflow: hidden !important;
  -webkit-line-clamp: 1 !important;
}
body {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: #19191d;
  font-weight: 300;
}

p {
  color: #b3b3b3;
  font-weight: 300;
}

h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3,
.h4,
.h5,
.h6 {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

a {
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
}
a,
a:hover {
  text-decoration: none !important;
}

.content {
  padding: 7rem 0;
}

h2 {
  font-size: 20px;
  color: #fff;
}

.custom-table {
  min-width: 900px;
}
.custom-table thead tr,
.custom-table thead th {
  border-top: none;
  border-bottom: none !important;
  color: #fff;
}
.custom-table tbody th,
.custom-table tbody td {
  color: #777;
  font-weight: 400;
  padding-bottom: 20px;
  padding-top: 20px;
  font-weight: 300;
}
.custom-table tbody th small,
.custom-table tbody td small {
  color: #b3b3b3;
  font-weight: 300;
}
.custom-table tbody tr:not(.spacer) {
  border-radius: 7px;
  overflow: hidden;
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
}
.custom-table tbody tr:not(.spacer):hover {
  -webkit-box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.1);
}
.custom-table tbody tr th,
.custom-table tbody tr td {
  background: #25252b;
  border: none;
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
}
.custom-table tbody tr th a,
.custom-table tbody tr td a {
  color: #b3b3b3;
}
.custom-table tbody tr th:first-child,
.custom-table tbody tr td:first-child {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.custom-table tbody tr th:last-child,
.custom-table tbody tr td:last-child {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.custom-table tbody tr.spacer td {
  padding: 0 !important;
  height: 3px;
  border-radius: 0 !important;
  background: transparent !important;
}
.custom-table tbody tr.active th,
.custom-table tbody tr.active td,
.custom-table tbody tr:hover th,
.custom-table tbody tr:hover td {
  color: #fff;
  background: #2e2e36;
}
.custom-table tbody tr.active th a,
.custom-table tbody tr.active td a,
.custom-table tbody tr:hover th a,
.custom-table tbody tr:hover td a {
  color: #fff;
}

/* Custom Checkbox */
.control {
  display: block;
  position: relative;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 18px;
}

.control input {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.control__indicator {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 4px;
  border: 2px solid #3f3f47;
  background: transparent;
}

.control--radio .control__indicator {
  border-radius: 50%;
}

.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  border: 2px solid #007bff;
}

.control input:checked ~ .control__indicator {
  border: 2px solid #007bff;
  background: #007bff;
}

.control input:disabled ~ .control__indicator {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
  border: 2px solid #ccc;
}

.control__indicator:after {
  font-family: "icomoon";
  content: "\e5ca";
  position: absolute;
  display: none;
}

.control input:checked ~ .control__indicator:after {
  display: block;
  color: #fff;
}

.control--checkbox .control__indicator:after {
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -52%);
  -ms-transform: translate(-50%, -52%);
  transform: translate(-50%, -52%);
}

.control--checkbox input:disabled ~ .control__indicator:after {
  border-color: #7b7b7b;
}

.control--checkbox input:disabled:checked ~ .control__indicator {
  background-color: #007bff;
  opacity: 0.2;
  border: 2px solid #007bff;
}
</style>