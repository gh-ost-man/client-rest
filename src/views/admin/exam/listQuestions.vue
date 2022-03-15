<template>
  <router-link :to="{ name: 'ExamsList' }" class="btn btn-outline-info">
    <i><font-awesome-icon icon="circle-arrow-left" /></i>
  </router-link>
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

    <div class="table-responsive custom-table-responsive" v-if="examQuestions">
      <pagination
        v-if="examQuestions"
        :pages="paggiExamQ.pages"
        :currentPage="currentPageExamQ"
        :totalPages="paggiExamQ.totalPages"
        @changePage="changePageExamQ"
      ></pagination>
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
          <template v-for="eq in examQItems" :key="eq.id">
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
              <td>
                {{ eq.id }}
              </td>
              <td style="max-width: 10%">{{ eq.question?.context }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <hr class="text-secondary" />

    <div class="mt-3">
      <div class="row">
        <div class="col-md-6">
          <h3 class="text-white">All questions</h3>
        </div>
        <div class="col-md-6">
          <div class="d-flex text-center">
            <select
              class="form-select c-select"
              aria-label="Default select example"
              v-model="filterCategory"
              v-if="questions"
            >
              <option value="" selected class="text-white">All</option>
              <option
                class="text-white"
                v-for="cat in categories"
                :key="cat.id"
                :value="cat.id"
                :v-model="filterCategory"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <hr class="text-white" />
    <div class="table-responsive custom-table-responsive" v-if="questions">
      <pagination
        v-if="questionItems"
        :pages="paggiAllQ.pages"
        :currentPage="currentPageAllQ"
        :totalPages="paggiAllQ.totalPages"
        @changePage="changePageAllQ"
      ></pagination>
      <button
        class="btn btn-outline-light"
        @click="addQuestionToExamHandle"
        v-if="selectedAddQuestions.length"
        :disabled="loading"
      >
        <span v-if="!loading"> Add to exam</span>
        <span v-else>Adding ...</span>
      </button>
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
    <div
      class="d-flex justify-content-center"
      v-if="!questions || !examQuestions"
    >
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
import { useRoute } from "vue-router";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(null);

    const questions = ref(null);
    const categories = ref(null);
    const examQuestions = ref(null);

    const route = useRoute();

    const { getAllQuestions, getQuestionById } = questionService();
    const { getAllCategories } = categoryService();
    const { getAllExamQuestions, addQuestionToExam, removeQuestionFromExam } =
      examService();

    const selectedAddAll = ref(false);
    const selectedRemoveAll = ref(false);
    const selectedAddQuestions = ref([]);
    const selectedRemoveQuestions = ref([]);
    const filterCategory = ref("");

    const currentPage = ref(1);
    const pageSize = 15;

    const paggiAllQ = ref(null);
    const currentPageAllQ = ref(1);

    const paggiExamQ = ref({ pages: [1], totalPages: 1 });
    const currentPageExamQ = ref(1);

    onMounted(async () => {
      await getDataExams();

      let resCategory = await getAllCategories();

      if (resCategory && resCategory.value) {
        if (resCategory.value.status === 200) {
          categories.value = resCategory.value.data.items;
          questions.value = [];
        } else {
          handleResponse(resCategory.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
      await getDataQuestions();
    });

    ///////////////////////////////////////////////////////////////////////
    //ExamQuestions

    /**
     * Gets data of exam and load questions of exam
     */
    const getDataExams = async () => {
      let resExamQues = await getAllExamQuestions(route.params.id);

      if (resExamQues && resExamQues.value) {
        if (resExamQues.value.status === 200) {
          examQuestions.value = resExamQues.value.data.items;

          for (const iterator of examQuestions.value) {
            let res = await getQuestionById(iterator.questionItemId);

            if (res && res.value) {
              if (res.value.status === 200) {
                iterator.question = res.value.data;
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
                });
              }
            }
          }

          console.log(examQuestions.value);
          if (currentPageExamQ.value > paggiExamQ.value.endPage) {
            currentPageExamQ.value = 1;
          }
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

    /**
     * Shows data by page
     */
    const examQItems = computed(() => {
      let arr = examQuestions.value || [];

      paggiExamQ.value = paginate(arr.length, currentPageExamQ.value, pageSize);

      return arr.slice(
        paggiExamQ.value.startIndex,
        paggiExamQ.value.endIndex + 1
      );
    });

    /**
     * Selects question for remove
     */
    const changeRemoveHandle = () => {
      selectedRemoveAll.value = !selectedRemoveAll.value;

      if (selectedRemoveAll.value) {
        selectedRemoveQuestions.value = examQItems.value;
      } else {
        selectedRemoveQuestions.value = [];
      }
    };

    /**
     * Checks whether the question of exam is selected
     *
     * @param {number} id Id Question
     */
    const checkedRemoveHandle = (id) => {
      return selectedRemoveQuestions.value.find((x) => x.id == id);
    };

    /**
     * Changes current page of exam questions
     *
     * @param {pag} New page
     */
    const changePageExamQ = async (pag) => {
      currentPageExamQ.value = pag;

      await getDataExams();
    };

    /**
     * Deletes selected questions from exam
     */
    const removeQuestionFromExamHandle = async () => {
      loading.value = true;
      for (const el of selectedRemoveQuestions.value) {
        let res = await removeQuestionFromExam(route.params.id, el.id);
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
      }

      loading.value = false;

      if (
        examQItems.value.length - selectedRemoveQuestions.value.length ===
        0
      ) {
        if (currentPageExamQ.value === paggiExamQ.value.endPage) {
          currentPageExamQ.value =
            currentPageExamQ.value - 1 < 1 ? 1 : currentPageExamQ.value - 1;
        }
      }

      console.log("Current page: ", currentPageExamQ.value);

      await getDataExams();

      selectedAddQuestions.value = [];
      selectedAddAll.value = false;
      selectedRemoveQuestions.value = [];
      selectedRemoveAll.value = false;
    };

    ///////////////////////////////////////////////////////////////////////
    //AllQuestions

    /**
     * Gets all questions
     */
    const getDataQuestions = async () => {
      let res = await getAllQuestions();

      if (res && res.value) {
        if (res.value.status === 200) {
          res.value.data.items.forEach((q) => {
            let cat = categories.value.find(
              (x) => x.id === q.questionCategoryId
            );
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
    };

    /**
     * Sort questions by id
     */
    const sortedQuestions = computed(() => {
      return questions.value
        ? questions.value.sort((x1, x2) => x1.id - x2.id)
        : null;
    });

    /**
     *  Selects question for add to exam
     */
    const changeAddHandle = () => {
      selectedAddAll.value = !selectedAddAll.value;

      if (selectedAddAll.value) {
        selectedAddQuestions.value = questionItems.value;
      } else {
        selectedAddQuestions.value = [];
      }
    };

    /**
     * Checks whether the question is selected
     *
     * @param {number} id Id question
     */
    const checkedAddHandle = (id) => {
      return selectedAddQuestions.value.find((x) => x.id == id);
    };

    /**
     * Filter questions by category
     */
    const filterByCategoryItems = computed(() => {
      currentPageAllQ.value = 1;

      return sortedQuestions.value
        ? filterCategory.value
          ? sortedQuestions.value.filter(
              (x) => x.questionCategoryId == filterCategory.value
            )
          : sortedQuestions.value
        : null;
    });

    /**
     * Selects all questions that are not in the exam
     */
    const questionItems = computed(() => {
      selectedAddAll.value = false;
      selectedAddQuestions.value = [];

      let arr = filterByCategoryItems.value
        ? filterByCategoryItems.value.filter((element) =>
            examQuestions.value
              ? !examQuestions.value.filter(
                  (x) => x.questionItemId === element.id
                ).length
              : null
          )
        : [];

      paggiAllQ.value = paginate(arr.length, currentPageAllQ.value, pageSize);

      return arr.slice(
        paggiAllQ.value.startIndex,
        paggiAllQ.value.endIndex + 1
      );
    });

    /**
     * Change current page of questions
     *
     * @param {number} pag New page
     */
    const changePageAllQ = (pag) => {
      currentPageAllQ.value = pag;
    };

    /**
     * Adds new questions to exam
     */
    const addQuestionToExamHandle = async () => {
      loading.value = true;

      for (const el of selectedAddQuestions.value) {
        let res = await addQuestionToExam(route.params.id, {
          question: el.context,
          questionItemId: el.id,
        });

        if (res && res.value) {
          if (res.value.status !== 201) {
            currentPageAllQ.value = 1;
            handleResponse(res.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }

      loading.value = false;

      if (
        questionItems.value.length - selectedAddQuestions.value.length ===
        0
      ) {
        if (currentPageAllQ.value === paggiAllQ.value.endPage) {
          currentPageAllQ.value =
            currentPageAllQ.value - 1 < 1 ? 1 : currentPageAllQ.value - 1;
        }
      }

      await getDataExams();

      selectedAddQuestions.value = [];
      selectedAddAll.value = false;
      selectedRemoveQuestions.value = [];
      selectedRemoveAll.value = false;
    };

    return {
      loading,
      examQuestions,
      examQItems,
      paggiExamQ,
      currentPageExamQ,
      selectedRemoveAll,
      selectedRemoveQuestions,
      changeRemoveHandle,
      checkedRemoveHandle,
      removeQuestionFromExamHandle,
      changePageExamQ,
      questions,
      categories,
      currentPage,
      pageSize,
      paggiAllQ,
      currentPageAllQ,
      selectedAddAll,
      filterCategory,
      questionItems,
      selectedAddQuestions,
      changeAddHandle,
      checkedAddHandle,
      addQuestionToExamHandle,
      changePageAllQ,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>
