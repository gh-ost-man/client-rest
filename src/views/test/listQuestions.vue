<template>
  <div class="p-3">
    <h3 class="text-white">Test questions</h3>
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
            <th scope="col">#</th>
            <th scope="col">Question</th>
            <th scope="col">QuestionItemId</th>
            <th scope="col">ExamItemId</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="eq in examQuestions" :key="eq.id">
            <tr scope="row">
              <td>{{ eq.id }}</td>
              <td>{{ eq.question }}</td>
              <td>{{ eq.questionItemId }}</td>
              <td>{{ eq.examItemId }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <h3 class="text-white mt-3">All questions</h3>
    <button
      class="btn btn-outline-light mt-3"
      @click="addQuestionToTestHandle"
      v-if="selectedQuestions.length"
      :disabled="loading"
    >
      <span v-if="!loading"> Add to test</span>
      <span v-else>Adding ...</span>
    </button>
    <hr class="text-white" />
    <div class="table-responsive custom-table-responsive" v-if="questions">
      <!-- <paggination
        :pages="paggination.pages"
        :currentPage="currentPage"
        @changePage="changePage"
      ></paggination> -->
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  class="js-check-all"
                  :checked="isAll"
                  @change="changeHandle"
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
              :class="{ 'checked-row': checkedHandle(question.id) }"
            >
              <th scope="row">
                <label
                  class="control control--checkbox"
                  :class="{ 'checked-row': checkedHandle(question.id) }"
                >
                  <input
                    type="checkbox"
                    :value="question"
                    v-model="selectedQuestions"
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
    const { getAllExamQuestions, addQuestionToExam } = examService();
    const currentPage = ref(1);
    const pageSize = 15;
    const isAll = ref(false);
    const selectedQuestions = ref([]);

    const fetchExamQuestions = async () => {
      let resExamQues = await getAllExamQuestions(route.params.id);

      if (resExamQues && resExamQues.value) {
        if (resExamQues.value.status === 200) {
          examQuestions.value = resExamQues.value.data;
        } else {
          error.value = JSON.stringify(
            handleResponse(resExamQues.value),
            undefined,
            2
          );
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
                error.value = JSON.stringify(
                  handleResponse(res.value),
                  undefined,
                  2
                );
              }
            }
          });
        } else {
          error.value = JSON.stringify(
            handleResponse(resCategory.value),
            undefined,
            2
          );
        }
      }
    });

    const changeHandle = () => {
      isAll.value = !isAll.value;

      if (isAll.value) {
        selectedQuestions.value = questions.value;
      } else {
        selectedQuestions.value = [];
      }
    };

    const checkedHandle = (value) => {
      return selectedQuestions.value.find((x) => x.id == value);
    };

    // питання який немає в тесті

    const questionItems = computed(() => {
      let arr = [];

      console.log("HERE");

      questions.value.forEach((element) => {
        if (
          !examQuestions.value.filter((x) => x.questionItemId === element.id)
            .length
        ) {
          arr.push(element);
        }
      });

      return arr;
    });

    const addQuestionToTestHandle = async () => {

      loading.value = true;

      await selectedQuestions.value.reduce(async (a,element) => {
        let res = await addQuestionToExam(route.params.id, {
          question: element.context,
          questionItemId: element.id,
        });

        if (res && res.value) {
          if (res.value.status !== 201) {
            error.value = JSON.stringify(
              handleResponse(res.value),
              undefined,
              2
            );
          }
        }
      }, Promise.resolve());

      loading.value = false;

      await fetchExamQuestions();

      selectedQuestions.value = [];
      isAll.value = false;
    };

    return {
      error,
      loading,
      questions,
      categories,
      examQuestions,
      currentPage,
      pageSize,
      isAll,
      questionItems,
      selectedQuestions,
      changeHandle,
      checkedHandle,
      addQuestionToTestHandle,
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
.custom-table tbody tr.checked-row th,
.custom-table tbody tr.checked-row td,
.custom-table tbody tr.checked-row th,
.custom-table tbody tr.checked-row td {
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
  content: "\2714";
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
