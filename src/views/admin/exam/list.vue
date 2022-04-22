<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Exams</h2>
      <hr class="bg-secondary" />

      <div class="row" v-if="exams">
        <div class="col-md-4 my-2">
          <router-link
            class="btn btn-outline-light"
            :to="{ name: 'CreateExam' }"
            v-if="isVisibleHandle(['Teacher'])"
            >Create</router-link
          >
        </div>
        <div class="col-md-8 my-2">
          <div class="row">
            <div class="col-md-5 my-2">
              <div>
                <input
                  class="form-control c-input"
                  placeholder="filter by title"
                  type="text"
                  v-model.trim="filterTitle"
                  @keydown.enter="filterByTitle"
                />
              </div>
            </div>
            <!-- <div class="col-md-5 my-2">
              <select
                class="form-select c-select"
                aria-label="Default select example"
                v-model="filterStatus"
                @change="filterByStatus"
              >
                <option value="" selected class="text-white">All</option>
                <option
                  class="text-white"
                  v-for="s in statuses"
                  :key="s.value"
                  :value="s.value"
                >
                  {{ s.title }}
                </option>
              </select>
            </div> -->
            <div class="col-md-2 my-1">
              <button class="btn btn-outline-light" @click="resetFilterHandle">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive" v-if="exams">
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
              <th scope="col">Title</th>
              <th scope="col">DurationTime</th>
              <th scope="col">PassingScore</th>
              <!-- <th scope="col">Status</th> -->
              <th scope="col">Qty of quesitons</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="exam in sortedExams" :key="exam.id">
              <tr class="c-table-hover" scope="row">
                <td>{{ exam.id }}</td>
                <td>{{ exam.title }}</td>
                <td>{{ exam.durationTime }}</td>
                <td>{{ exam.passingScore }}</td>
                <!-- <td>{{ exam.status }}</td> -->
                <td>{{ exam.qtyOfQuestions }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-light mx-1"
                    :to="{ name: 'ExamQuestions', params: { id: exam.id } }"
                    v-if="isVisibleHandle(['Teacher'])"
                  >
                    <i class="icon"> <font-awesome-icon icon="list-ul" /></i>
                  </router-link>
                  <router-link
                    class="btn btn-outline-light mx-1"
                    :to="{ name: 'EditExam', params: { id: exam.id } }"
                    v-if="isVisibleHandle(['Teacher'])"
                  >
                    <i class="icon">
                      <font-awesome-icon icon="pen-to-square"
                    /></i>
                  </router-link>
                  <router-link
                     v-if="isVisibleHandle(['Manager'])"
                    :to="{ name: 'ExamUsers', params: { id: exam.id } }"
                    class="btn btn-outline-light mx-1"
                  >
                    <i class="icon">
                      <font-awesome-icon icon="user-graduate"
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
    <div class="d-flex justify-content-center" v-if="!exams">
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
import examService from "@/_services/examService.js";
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const exams = ref(null);

    const filterTitle = ref("");
    // const filterStatus = ref("");

    const { getAllExams, getAllExamQuestions } = examService();
    const { currentUser } = authService();

    const pagination = ref({ pages: [1], totalPages: 1 });
    const pageSize = 15;
    const currentPage = ref(1);
    const middleVal = ref(10);
    const cntBetween = ref(5);

    // const statuses = ref([
    //   {
    //     title: "NotAvailable",
    //     key: 0,
    //     value: "NotAvailable",
    //   },
    //   {
    //     title: "Available",
    //     key: 1,
    //     value: "Available",
    //   },
    //   {
    //     title: "Finished",
    //     key: 2,
    //     value: "Finished",
    //   },
    // ]);

    onMounted(async () => {
      getFilterFromStorage();
      await getData();
    });

    /**
     * Gets all exams from server
     */
    const getData = async () => {
      let filter = {};
      if (filterTitle.value) {
        filter.title = filterTitle.value;
      }

      // if (filterStatus.value) {
      //   filter.status = filterStatus.value;
      // }

      filterStorage();

      let response = await getAllExams(
        currentPage.value,
        pageSize,
        filter,
        middleVal.value,
        cntBetween.value
      );
      if (response && response.value) {
        if (response.value.status === 200) {
          exams.value = response.value.data.items;
          pagination.value = {
            pages: response.value.data.pages,
            totalPages: response.value.data.totalPages,
          };
          console.log(response.value);
          for (const element of exams.value) {
            // element.status = statuses.value.find(
            //   (x) => x.key === element.status
            // ).title;

            let res = await getAllExamQuestions(element.id);

            if (res && res.value) {
              if (res.value.status === 200) {
                element.qtyOfQuestions = res.value.data.items.length;
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
     * Filters exams by title exam
     */
    const filterByTitle = async () => {
      currentPage.value = 1;
      await getData();
    };

    /**
     * Filters exams by status exam
     */
    // const filterByStatus = async () => {
    //   currentPage.value = 1;
    //   await getData();
    // };

    /**
     * Changes current page
     *
     * @param {number} pag New page
     */
    const changePage = async (pag) => {
      currentPage.value = pag;
      exams.value = [];

      await getData();
    };

    /**
     * Sort exams by id
     */
    const sortedExams = computed(() => {
      return exams.value
        ? exams.value.sort((x1, x2) => x1.id - x2.id)
        : exams.value;
    });

    /**
     * Reset all filters
     */
    const resetFilterHandle = async () => {
      filterTitle.value = null;
      // filterStatus.value = "";
      currentPage.value = 1;

      await getData();
    };

    /**
     * Saves all filter into storage
     */
    const filterStorage = () => {
      let filterObj = {};

      filterObj.title = filterTitle.value;
      // filterObj.status = filterStatus.value;
      filterObj.currentPage = currentPage.value;

      sessionStorage.filterExams = JSON.stringify(filterObj);
    };

    /**
     * Gets all filters from storage
     */
    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem("filterExams");

      if (filter) {
        let filterObj = JSON.parse(filter);
        filterTitle.value = filterObj.title ? filterObj.title : "";
        // filterStatus.value = filterObj.status ? filterObj.status : "";
        currentPage.value = filterObj.currentPage || "";
      }
    };

    const isVisibleHandle = (authRoles) => {
      if (!currentUser.value) return false;

      let userRoles = currentUser.value.roles.split(",");

      for (let role of userRoles) {
        if (authRoles.includes(role)) {
          return true;
        }
      }

      return false;
    };
    return {
      exams,
      sortedExams,
      currentPage,
      // statuses,
      filterTitle,
      // filterStatus,
      pagination,
      middleVal,
      changePage,
      filterByTitle,
      resetFilterHandle,
      // filterByStatus,
      isVisibleHandle,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>