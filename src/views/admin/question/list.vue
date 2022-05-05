<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Questions</h2>
      <hr class="bg-info" />
      <div class="row" v-if="questions">
        <div class="col-md-4 my-2">
          <div>
            <router-link
              class="btn btn-outline-info"
              :to="{ name: 'CreateQuestion' }"
              >Create</router-link
            >
          </div>
        </div>
        <div class="col-md-8 my-2">
          <div class="row">
            <div class="col-md-4 my-1">
              <div>
                <input
                  class="form-control c-input"
                  placeholder="filter by context"
                  type="text"
                  v-model.trim="filterContext"
                  @keydown.enter="filterHandle"
                />
              </div>
            </div>
            <div class="col-md-4 my-1">
              <select
                class="form-select c-select"
                aria-label="Default select example"
                v-model="filterCategory"
                @change="filterHandle"
              >
                <option value="" selected class="text-white">All</option>
                <option
                  class="text-white"
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4 my-1">
              <button class="btn btn-outline-info" @click="resetFilterHandle">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="bg-info" />
      <div class="table-responsive custom-table-responsive" v-if="questions">
        <pagination
          :middleVal="middleVal"
          :pages="pagination.pages"
          :currentPage="currentPage"
          :totalPages="pagination.totalPages"
          @changePage="changePage"
        ></pagination>
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
            <template v-for="question in sortedQuestions" :key="question.id">
              <tr class="c-table-hover" scope="row">
                <td>{{ question.id }}</td>
                <td>{{ question.context }}</td>
                <td>
                  {{ new Date(question.releaseDate).toLocaleDateString() }}
                </td>
                <td>{{ question.category }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-warning text-warning"
                    :to="{
                      name: 'EditQuestion',
                      params: {
                        id: question.id,
                      },
                    }"
                  >
                    <i class="icon">
                      <font-awesome-icon icon="pen-to-square"
                    /></i>
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
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;

    const questions = ref(null);
    const categories = ref(null);

    const { getAllQuestions } = questionService();
    const { getAllCategories } = categoryService();

    const filterCategory = ref("");
    const filterContext = ref(null);

    const pagination = ref({ pages: [1], totalPages: 1 });
    const pageSize = 15;
    const currentPage = ref(1);
    const middleVal = ref(10);
    const cntBetween = ref(5);

    onMounted(async () => {
      getFilterFromStorage();
      let response = await getAllCategories();

      if (response && response.value) {
        if (response.value.status === 200) {
          categories.value = response.value.data.items;
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
      await getData();
    });

    /**
     * Gets all questions from server
     */
    const getData = async () => {
      let filter = {};
      if (filterCategory.value) {
        filter.category = filterCategory.value;
      }

      if (filterContext.value) {
        filter.context = filterContext.value;
      }

      filterStorage();
      let responseQ = await getAllQuestions(
        currentPage.value,
        pageSize,
        filter,
        middleVal.value,
        cntBetween.value
      );

      if (responseQ && responseQ.value) {
        if (responseQ.value.status === 200) {
          questions.value = responseQ.value.data.items;

          questions.value.forEach((element) => {
            let cat = categories.value.find(
              (x) => x.id === element.questionCategoryId
            );
            element.category = cat.name;
          });

          pagination.value = {
            pages: responseQ.value.data.pages,
            totalPages: responseQ.value.data.totalPages,
          };
        }
      }
    };

    /**
     * Sort question by id
     */
    const sortedQuestions = computed(() => {
      return questions.value
        ? questions.value.sort((x1, x2) => x1.id - x2.id)
        : null;
    });

    /**
     * Changes current page
     * @param {number} pag New page
     */
    const changePage = async (pag) => {
      currentPage.value = pag;

      await getData();
    };

    const filterHandle = async () => {
      currentPage.value = 1;
      await getData();
    };

    /**
     * Resets all filters
     */
    const resetFilterHandle = async () => {
      filterContext.value = null;
      filterCategory.value = "";
      currentPage.value = 1;

      await getData();
    };

    /**
     * Save filters to storage
     */
    const filterStorage = () => {
      let filterObj = {};

      filterObj.context = filterContext.value;
      filterObj.category = filterCategory.value;
      filterObj.currentPage = currentPage.value;

      sessionStorage.filterQuestions = JSON.stringify(filterObj);
    };

    /**
     * /Get filters from storage
     */
    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem("filterQuestions");

      if (filter) {
        let filterObj = JSON.parse(filter);
        filterContext.value = filterObj.context || "";
        filterCategory.value = filterObj.category || "";
        currentPage.value = filterObj.currentPage ? filterObj.currentPage : 1;
      }
    };

    return {
      categories,
      questions,
      sortedQuestions,
      currentPage,
      pagination,
      middleVal,
      filterCategory,
      filterContext,
      filterHandle,
      changePage,
      resetFilterHandle,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>