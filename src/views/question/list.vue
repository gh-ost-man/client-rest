<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Questions</h2>
      <hr class="bg-info" />
      <div class="row" v-if="questions">
        <div class="col-md-4 my-2">
          <div>
            <router-link
              class="btn btn-outline-light"
              :to="{ name: 'CreateQuestion' }"
              >Create</router-link
            >
          </div>
        </div>
        <div class="col-md-8 my-2">
          <div class="row" >
            <div class="col-md-6 my-1">
              <div>
                <input
                  class="form-control c-input"
                  placeholder="filter by context"
                  type="text"
                  v-model.trim="filterContext"
                />
              </div>
            </div>
            <div class="col-md-6 my-1">
              <select
                class="form-select c-select"
                aria-label="Default select example"
                v-model="filterCategory"
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
          </div>
        </div>
      </div>
      <hr class="bg-info" />
      <div class="table-responsive custom-table-responsive" v-if="questions">
        <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          :totalPages="paggination.totalPages"
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
                <td>
                  {{ new Date(question.releaseDate).toLocaleDateString() }}
                </td>
                <td>{{ question.category }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-light"
                    :to="{
                      name: 'EditQuestion',
                      params: {
                        id: question.id,
                        categoryId: question.questionCategoryId,
                      },
                    }"
                  >
                  <i class="icon"> <font-awesome-icon icon="pen-to-square" /></i>
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
    const questions = ref(null);
    const categories = ref(null);
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getQuestions } = questionService();
    const { getAllCategories } = categoryService();
    const currentPage = ref(1);
    const pageSize = 15;
    const filterCategory = ref("");
    const filterContext = ref(null);

    const paggination = ref(null);

    onMounted(async () => {
      getFilterFromStorage();
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
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
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
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    });

    const sortedQuestions = computed(() => {
      return questions.value
        ? questions.value.sort((x1, x2) => x1.id - x2.id)
        : null;
    });

    const changePage = (pag) => {
      currentPage.value = pag;
    };

    const filterByContext = computed(() => {
      currentPage.value = 1;
      return filterContext.value
        ? sortedQuestions.value.filter((x) =>
            x.context.toLowerCase().includes(filterContext.value.toLowerCase())
          )
        : sortedQuestions.value;
    });

    const filterByCategory = computed(() => {
      currentPage.value = 1;
      return filterCategory.value
        ? filterByContext.value.filter(
            (x) => x.questionCategoryId == filterCategory.value
          )
        : filterByContext.value;
    });

    const questionsItems = computed(() => {
      filterStorage();
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

    //Save filter to storage
    const filterStorage = () => {
      let filterObj = {};

      filterObj.context = filterContext.value;
      filterObj.category = filterCategory.value;

      sessionStorage.filterQuestions = JSON.stringify(filterObj);
    };

    //Get filter fromstorage
    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem("filterQuestions");

      if (filter) {
        let filterObj = JSON.parse(filter);
        filterContext.value = filterObj.context || "";
        filterCategory.value = filterObj.category || "";
      }
    };

    return {
      categories,
      questions,
      error,
      questionsItems,
      currentPage,
      paggination,
      filterCategory,
      filterContext,
      changePage,
      // resetFilter,
    };
  },
};
</script>

<style scoped>
@import "../../assets/css/table.css";
</style>