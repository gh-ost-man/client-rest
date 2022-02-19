<template>
 <router-link :to="{name:'Exams'}" class="btn btn-outline-info"><i class="fa-solid fa-circle-arrow-left"></i></router-link>
  <div class="p-3">
    <div class="d-flex">
      <h3 class="text-white">Exam questions</h3>
      <button
        class="btn btn-outline-light mx-3"
        @click="removeQuestionFromExamHandle"
        v-if="selectedRemoveQuestions.length"
        :disabled="loading"
      >
        <span v-if="!loading">Remove from exam</span>
        <span v-else>Removing ...</span>
      </button>
    </div>
    <hr class="text-white" />
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

    <div class="table-responsive custom-table-responsive" v-if="examQuestions">
      <!-- <paggination
        :pages="paggination.pages"
        :currentPage="currentPage"
        @changePage="changePage"
      ></paggination> -->
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col" style="width: 60px">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  class="js-check-all"
                  :checked="selectedRemoveAll"
                  @change="changeRemoveHandle"
                />
                <div class="control__indicator"></div>
              </label>
            </th>
            <th scope="col">#</th>
            <th scope="col">Question</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="eq in examQuestions" :key="eq.id">
            <tr
              scope="row"
              :class="{ 'checked-row': checkedRemoveHandle(eq.id) }"
            >
              <td scope="row">
                <label
                  class="control control--checkbox"
                  :class="{ 'checked-row': checkedRemoveHandle(eq.id) }"
                >
                  <input
                    type="checkbox"
                    :value="eq"
                    v-model="selectedRemoveQuestions"
                  />
                  <div class="control__indicator"></div>
                </label>
              </td>
              <td>{{ eq.id }}</td>
              <td style="max-width: 10%">{{ eq.question }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="d-flex mt-3">
      <h3 class="text-white">All questions</h3>
      <div class="d-flex text-center mx-4">
        <label class="labels text-white w-auto fw-bolder mx-2">Filter</label>
        <select
          class="form-select bg-transparent text-white"
          aria-label="Default select example"
          v-model="filterCategory"
        >
          <option disabled selected class="text-white">Select category</option>
          <option
            class="text-dark"
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
            :v-model="filterCategory"
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
      <button
        class="btn btn-outline-light mx-3"
        @click="addQuestionToExamHandle"
        v-if="selectedAddQuestions.length"
        :disabled="loading"
      >
        <span v-if="!loading"> Add to exam</span>
        <span v-else>Adding ...</span>
      </button>
    </div>

    <hr class="text-white" />
    <div class="table-responsive custom-table-responsive" v-if="questionItems">
      <paggination
        v-if="paggiAllQ"
        :pages="paggiAllQ.pages"
        :currentPage="currentPageAllQ"
        @changePage="changePageAllQ"
      ></paggination>
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  class="js-check-all"
                  :checked="selectedAddAll"
                  @change="changeAddHandle"
                />
                <div class="control__indicator"></div>
              </label>
            </th>
            <th scope="col">#</th>
            <th scope="col">Context</th>
            <th scope="col">ReleaseDate</th>
            <th scope="col">Category</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="question in questionItems" :key="question.id">
            <tr
              scope="row"
              :class="{ 'checked-row': checkedAddHandle(question.id) }"
            >
              <th scope="row">
                <label
                  class="control control--checkbox"
                  :class="{ 'checked-row': checkedAddHandle(question.id) }"
                >
                  <input
                    type="checkbox"
                    :value="question"
                    v-model="selectedAddQuestions"
                  />
                  <div class="control__indicator"></div>
                </label>
              </th>
              <td>{{ question.id }}</td>
              <td class="w-50">{{ question.context }}</td>
              <td>
                {{ new Date(question.releaseDate).toLocaleDateString() }}
              </td>
              <td>{{ question.category }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { useRoute } from "vue-router";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Paggination from "@/components/Paggination";
export default {
  components: { Paggination },
  setup() {
    const error = ref(null);
    const loading = ref(null);
    const questions = ref(null);
    const categories = ref(null);
    const examQuestions = ref(null);
    const route = useRoute();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getQuestions } = questionService();
    const { getAllCategories } = categoryService();
    const { getAllExamQuestions, addQuestionToExam, removeQuestionFromExam } =
      examService();
    const currentPage = ref(1);
    const pageSize = 15;
    const selectedAddAll = ref(false);
    const selectedRemoveAll = ref(false);
    const selectedAddQuestions = ref([]);
    const selectedRemoveQuestions = ref([]);
    const filterCategory = ref(null);


    const paggiAllQ = ref(null);
    const currentPageAllQ = ref(1);


    const fetchExamQuestions = async () => {
      let resExamQues = await getAllExamQuestions(route.params.id);

      if (resExamQues && resExamQues.value) {
        if (resExamQues.value.status === 200) {
          examQuestions.value = resExamQues.value.data;
        } else {
           handleResponse(resExamQues.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    onMounted(async () => {
      await fetchExamQuestions();

      let resCategory = await getAllCategories();

      if (resCategory && resCategory.value) {
        if (resCategory.value.status === 200) {
          categories.value = resCategory.value.data;
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
        } else {
          handleResponse(resCategory.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    });

    const sortedQuestions = computed(() => {
      return questions.value?questions.value.sort((x1,x2) => x1.id - x2.id):null;
    });

    const changeAddHandle = () => {
      selectedAddAll.value = !selectedAddAll.value;

      if (selectedAddAll.value) {
        selectedAddQuestions.value = questionItems.value;
      } else {
        selectedAddQuestions.value = [];
      }
    };

    const checkedAddHandle = (value) => {
      return selectedAddQuestions.value.find((x) => x.id == value);
    };

    const changeRemoveHandle = () => {
      selectedRemoveAll.value = !selectedRemoveAll.value;

      if (selectedRemoveAll.value) {
        selectedRemoveQuestions.value = examQuestions.value;
      } else {
        selectedRemoveQuestions.value = [];
      }
    };

    const checkedRemoveHandle = (value) => {
      return selectedRemoveQuestions.value.find((x) => x.id == value);
    };

    const filterByCategoryItems = computed(() => {
      currentPage.value = 1;
      
      return filterCategory.value
        ? sortedQuestions.value.filter(
            (x) => x.questionCategoryId == filterCategory.value
          )
        : sortedQuestions.value;

        
    });

    // питання який немає в тесті

    const questionItems = computed(() => {
       selectedAddAll.value = false;
       selectedAddQuestions.value = [];
        let arr =  filterByCategoryItems.value?filterByCategoryItems.value.filter(element=> !examQuestions.value.filter((x) => x.questionItemId === element.id).length): null;

          paggiAllQ.value = paginate(
           arr? arr.length: 0,
            currentPageAllQ.value,
            pageSize
          );
      // вибираєм всі questions який немає в exam questions
      return arr?arr.slice(
        paggiAllQ.value.startIndex,
        paggiAllQ.value.endIndex + 1
      ):null;
      //  return exams.value.slice(
      //   paggination.value.startIndex,
      //   paggination.value.endIndex + 1
      // );
            
    });

      const changePageAllQ = (pag) => {
      currentPageAllQ.value = pag;
    };


    const addQuestionToExamHandle = async () => {
      loading.value = true;

      await selectedAddQuestions.value.reduce(async (a, element) => {
        let res = await addQuestionToExam(route.params.id, {
          question: element.context,
          questionItemId: element.id,
        });

        if (res && res.value) {
          if (res.value.status !== 201) {
            handleResponse(res.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
          }
        }
      }, Promise.resolve());

      loading.value = false;

      await fetchExamQuestions();

      selectedAddQuestions.value = [];
      selectedAddAll.value = false;
    };

    const removeQuestionFromExamHandle = async () => {
      loading.value = true;

      await selectedRemoveQuestions.value.reduce(async (a, element) => {
        let res = await removeQuestionFromExam(route.params.id, element.id);
        if (res && res.value) {
          if (res.value.status !== 204) {
             handleResponse(res.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
          }
        }
      }, Promise.resolve());

      loading.value = false;

      await fetchExamQuestions();
      selectedRemoveQuestions.value = [];
      selectedRemoveAll.value = false;
    };

    const resetFilter = () => {
      filterCategory.value = null;
      currentPage.value = 1;
    }

    return {
      error,
      loading,
      questions,
      categories,
      examQuestions,
      currentPage,
      pageSize,
      paggiAllQ,
      currentPageAllQ,
      selectedAddAll,
      selectedRemoveAll,
      selectedRemoveQuestions,
      filterCategory,
      questionItems,
      selectedAddQuestions,
      changeAddHandle,
      checkedAddHandle,
      addQuestionToExamHandle,
      changeRemoveHandle,
      checkedRemoveHandle,
      removeQuestionFromExamHandle,
      resetFilter,
      changePageAllQ,
    };
  },
};
</script>

<style scopped>
@import "../../assets/table.css";

</style>
