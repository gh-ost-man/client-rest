<template>
  <router-link :to="{ name: 'UsersList' }" class="btn btn-outline-info">
    <i><font-awesome-icon icon="circle-arrow-left" /></i>
  </router-link>
  <div class="p-3">
    <div class="d-flex">
      <h3 class="text-white">User Exams</h3>
      <button
        class="btn btn-outline-light mx-1"
        @click="removeExamFromUserHandle"
        v-if="selectedRemoveExams.length"
        :disabled="loading"
      >
        <span>Remove exam</span>
      </button>
    </div>
    <hr class="text-secondary" />
    <div class="table-responsive custom-table-responsive" v-if="userExams">
      <pagination
        v-if="userExams"
        :pages="paggiUExams.pages"
        :currentPage="currentPageUExams"
        :totalPages="paggiUExams.totalPages"
        @changePage="changePageUExams"
      ></pagination>

      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col">
              <label class="control control--checkbox">
                <input
                  type="checkbox"
                  class="js-check-all"
                  :checked="isSelectedRemoveExams"
                  @change="changeRemoveHandle"
                />
                <div class="control__indicator"></div>
              </label>
            </th>
            <th scope="col">Title</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="ue in userExamsItems" :key="ue.examId">
            <tr
              scope="row"
              :class="{ 'checked-row': checkedRemoveHandle(ue.examId) }"
            >
              <th scope="row">
                <label
                  class="control control--checkbox"
                  :class="{ 'checked-row': checkedRemoveHandle(ue.examId) }"
                >
                  <input
                    type="checkbox"
                    :value="ue"
                    v-model="selectedRemoveExams"
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
      <pagination
        v-if="examItems"
        :pages="paggiExams.pages"
        :currentPage="currentPageExam"
        :totalPages="paggiExams.totalPages"
        @changePage="changePageExam"
      ></pagination>
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
import paginate from "@/_helpers/paginate.js";
import Pagination from "@/components/Pagination";
export default {
  props: ["id"],
  components: { Pagination },
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);

    const { getUserExams, addExamToUser, removeExamFromUser } = userService();
    const { getAllExams, getExamById } = examService();

    const exams = ref(null);
    const userExams = ref(null);

    const isSelectedRemoveExams = ref(false);
    const isSelectedAddAll = ref(false);
    const selectedRemoveExams = ref([]);
    const selectedAddExams = ref([]);

    const paggiExams = ref({
      pages: [1],
      totalPages: 1,
      startIndex: 0,
      endIndex: 0,
    });
    const paggiUExams = ref({
      pages: [1],
      totalPages: 1,
      startIndex: 0,
      endIndex: 0,
    });

    const currentPageUExams = ref(1);
    const currentPageExam = ref(1);
    const pageSize = 5;

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

    //UserExam ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Gets all exams of user
     */
    const fetchUserExams = async () => {
      let response = await getUserExams(props.id);

      if (response && response.value) {
        if (response.value.status === 200) {
          userExams.value = response.value.data.items;

          for (const iterator of userExams.value) {
            let res = await getExamById(iterator.examId);

            if (res && res.value) {
              if (res.value.status === 200) {
                iterator.exam = res.value.data;
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

    /**
     * Selects exams for delete from user
     */
    const changeRemoveHandle = () => {
      isSelectedRemoveExams.value = !isSelectedRemoveExams.value;

      if (isSelectedRemoveExams.value) {
        selectedRemoveExams.value = userExamsItems.value;
      } else {
        selectedRemoveExams.value = [];
      }
    };

    /**
     * Deletes exam from user
     */
    const removeExamFromUserHandle = async () => {
      loading.value = true;

      for (const iterator of selectedRemoveExams.value) {
        let res = await removeExamFromUser({
          userId: props.id,
          examId: iterator.examId,
        });

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
      }

      loading.value = false;

      if (
        userExamsItems.value.length - selectedRemoveExams.value.length ===
        0
      ) {
        if (currentPageUExams.value === paggiUExams.value.endPage) {
          currentPageUExams.value =
            currentPageUExams.value - 1 < 1 ? 1 : currentPageUExams.value - 1;
        }
      }

      isSelectedRemoveExams.value = false;
      selectedRemoveExams.value = [];
      isSelectedAddAll.value = false;
      selectedAddExams.value = [];

      await fetchUserExams();
    };

    /**
     * Checks whether the exam is selected
     */
    const checkedRemoveHandle = (id) => {
      return selectedRemoveExams.value.find((x) => x.examId == id);
    };

    /**
     * Changes current page
     *
     * @param {number} page New page
     */
    const changePageUExams = (page) => {
      currentPageUExams.value = page;

      isSelectedRemoveExams.value = false;
      selectedRemoveExams.value = [];
    };

    /**
     * Show exams of user by page
     */
    const userExamsItems = computed(() => {
      let arr = userExams.value || [];

      paggiUExams.value = paginate(
        arr.length,
        currentPageUExams.value,
        pageSize
      );

      return arr.slice(
        paggiUExams.value.startIndex,
        paggiUExams.value.endIndex + 1
      );
    });

    //AllExam ///////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Checks whether the exam is selected
     *
     * @param {number} id Id Exam
     */
    const checkedAddHandle = (id) => {
      return selectedAddExams.value.find((x) => x.id == id);
    };

    /**
     * Selects exams for add to user
     */
    const changeAddHandle = () => {
      isSelectedAddAll.value = !isSelectedAddAll.value;

      if (isSelectedAddAll.value) {
        selectedAddExams.value = examItems.value;
      } else {
        selectedAddExams.value = [];
      }
    };

    /**
     * Add new exams to user
     */
    const addExamToUserHandle = async () => {
      loading.value = true;

      for (const iterator of selectedAddExams.value) {
        let res = await addExamToUser({
          userId: props.id,
          examId: iterator.id,
        });

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
      }

      loading.value = false;

      if (examItems.value.length - selectedAddExams.value.length === 0) {
        if (currentPageExam.value === paggiExams.value.endPage) {
          currentPageExam.value =
            currentPageExam.value - 1 < 1 ? 1 : currentPageExam.value - 1;
        }
      }
      isSelectedRemoveExams.value = false;
      selectedRemoveExams.value = [];
      isSelectedAddAll.value = false;
      selectedAddExams.value = [];

      await fetchUserExams();
    };

    /**
     * select all exams that are not in the user
     */
    const examItems = computed(() => {
      let arr = exams.value
        ? exams.value.filter((element) =>
            userExams.value
              ? !userExams.value.filter((x) => x.examId === element.id).length
              : null
          )
        : [];

      paggiExams.value = paginate(arr.length, currentPageExam.value, pageSize);

      return arr.slice(
        paggiExams.value.startIndex,
        paggiExams.value.endIndex + 1
      );
    });

    /**
     * Changes current page
     *
     * @param {number} page New page
     */
    const changePageExam = (page) => {
      currentPageExam.value = page;

      isSelectedAddAll.value = false;
      selectedAddExams.value = [];
    };
    return {
      loading,
      userExams,
      userExamsItems,
      isSelectedRemoveExams,
      selectedRemoveExams,
      paggiUExams,
      currentPageUExams,
      changePageUExams,
      changeRemoveHandle,
      removeExamFromUserHandle,
      exams,
      examItems,
      isSelectedAddAll,
      selectedAddExams,
      paggiExams,
      currentPageExam,
      changeAddHandle,
      checkedAddHandle,
      changePageExam,
      checkedRemoveHandle,
      addExamToUserHandle,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>