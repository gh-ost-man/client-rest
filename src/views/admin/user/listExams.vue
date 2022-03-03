<template>
  <router-link :to="{ name: 'UsersList' }" class="btn btn-outline-info">
    <i><font-awesome-icon icon="circle-arrow-left" /></i>
  </router-link>
  <div class="p-3">
    <h3 class="text-white">User Exams</h3>
    <hr class="text-secondary" />
    <div class="table-responsive custom-table-responsive" v-if="userExams">
      <!-- <paggination
        v-if="questionItems"
        :pages="paggiAllQ.pages"
        :currentPage="currentPageAllQ"
        :totalPages="paggiAllQ.totalPages"
        @changePage="changePageAllQ"
      ></paggination> -->
      <!-- <button
        class="btn btn-outline-light"
        @click="addQuestionToExamHandle"
        v-if="selectedAddQuestions.length"
        :disabled="loading"
      >
        <span v-if="!loading"> Add to exam</span>
        <span v-else>Adding ...</span>
      </button> -->
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  class="js-check-all"
                  :checked="isSelectedAddAll"
                  @change="changeAddHandle"
                />
                <div class="control__indicator"></div>
              </label>
            </th>
            <th scope="col">Title</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="ue in userExams" :key="ue.examId">
            <tr
              scope="row"
              :class="{ 'checked-row': checkedAddHandle(ue.examId) }"
            >
              <th scope="row">
                <label
                  class="control control--checkbox"
                  :class="{ 'checked-row': checkedAddHandle(ue.examId) }"
                >
                  <input
                    type="checkbox"
                    :value="ue"
                    v-model="isSelectedAllExams"
                  />
                  <div class="control__indicator"></div>
                </label>
              </th>
              <td>{{ ue.exam?.title }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="d-flex">
      <h3 class="text-white">All Exams</h3>
      <button
        class="btn btn-outline-light mx-3"
        @click="addExamToUserHandle"
        v-if="selectedAddExams.length"
        :disabled="loading"
      >
        <span>Add to user</span>
      </button>
    </div>
    <hr class="text-white" />

    <hr class="text-secondary" />
    <div class="table-responsive custom-table-responsive" v-if="exams">
      <!-- <paggination
        v-if="examQuestions"
        :pages="paggiExamQ.pages"
        :currentPage="currentPageExamQ"
        :totalPages="paggiExamQ.totalPages"
        @changePage="changePageExamQ"
      ></paggination> -->
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col" style="width: 60px">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  class="js-check-all"
                  :checked="isSelectedAddAll"
                  @change="changeAddHandle"
                />
                <div class="control__indicator"></div>
              </label>
            </th>
            <th scope="col">#</th>
            <th scope="col">Title</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="e in examItems" :key="e.id">
            <tr scope="row" :class="{ 'checked-row': checkedAddHandle(e.id) }">
              <td scope="row">
                <label
                  class="control control--checkbox"
                  :class="{ 'checked-row': checkedAddHandle(e.id) }"
                >
                  <input
                    type="checkbox"
                    :value="e"
                    v-model="selectedAddExams"
                  />
                  <div class="control__indicator"></div>
                </label>
              </td>
              <td>{{ e.id }}</td>
              <td style="max-width: 10%">{{ e.title }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- <div class="mt-3">
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
    </div> -->

    <div class="d-flex justify-content-center" v-if="!userExams || !exams">
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
import handleResponse from "@/_helpers/handleResponse.js";
import userService from "@/_services/userService.js";
import examService from "@/_services/examService.js";
import { onMounted, ref, getCurrentInstance, computed } from "vue";
export default {
  props: ["id"],
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);
    const { getUserExams, addExamToUser, removeExamFromUser, getById } =
      userService();
    const { getAllExams, getExamById } = examService();
    const exams = ref(null);
    const userExams = ref(null);
    const isSelectedAllExams = ref(false);
    const isSelectedAddAll = ref(false);
    const selectedAddExams = ref([]);

    onMounted(async () => {
      await fetchUserExams();

      let resExam = await getAllExams();
      if (resExam && resExam.value) {
        if (resExam.value.status === 200) {
          exams.value = resExam.value.data.items;
        } else {
          handleResponse(resExam.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    });

    //UserExam

    const fetchUserExams = async () => {
      let response = await getUserExams(props.id);

      console.log(props.id);

      if (response && response.value) {
        if (response.value.status === 200) {
          console.log(response.value.data);
          userExams.value = response.value.data;

          await userExams.value.reduce(async (a, item) => {
            let res = await getExamById(item.examId);

            if (res && res.value) {
              if (res.value.status === 200) {
                item.exam = res.value.data;
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
                });
              }
            }
          }, Promise.resolve());
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

    const checkedRemoveHandle = (id) => {};

    //AllExam

    const checkedAddHandle = (id) => {
      return selectedAddExams.value.find((x) => x.id == id);
    };
    const changeAddHandle = () => {
      isSelectedAddAll.value = !isSelectedAddAll.value;

      if (isSelectedAddAll.value) {
        selectedAddExams.value = examItems.value;
      } else {
        selectedAddExams.value = [];
      }
    };

    const addExamToUserHandle = async () => {
      loading.value = true;

      await selectedAddExams.value.reduce(async (a, item) => {
        let res = await addExamToUser({ userId: props.id, examId: item.id });

        if (res && res.value) {
          if (res.value.status !== 200) {
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
      
      await fetchUserExams();

      isSelectedAllExams.value = false;
      selectedAddExams.value = [];
      
      };

    //вибираєм всі екзамени яких немає в user
    const examItems = computed(() => {
      let arr = exams.value
        ? exams.value.filter((element) =>
            userExams.value
              ? !userExams.value.filter((x) => x.examId === element.id).length
              : null
          )
        : [];

      return arr;
    });

    return {
      loading,
      userExams,
      isSelectedAddAll,
      exams,
      examItems,
      checkedAddHandle,
      checkedRemoveHandle,
      isSelectedAllExams,
      selectedAddExams,
      changeAddHandle,
      addExamToUserHandle,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>