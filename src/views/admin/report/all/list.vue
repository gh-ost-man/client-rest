<template>
  <div class="p-3">
    <div v-if="reports">
      <h3 class="text-white">Reports</h3>
      <hr class="bg-info" />
      <div class="row">
        <!-- <div class="col-md-3">
          <input
            class="form-control c-input"
            placeholder="filter by user"
            type="text"
            v-model.trim="filterUser"
            @keydown.enter="filterHandle"
          />
        </div>
        <div class="col-md-3">
          <input
            class="form-control c-input"
            placeholder="filter by exam"
            type="text"
             v-model.trim="filterExam"
            @keydown.enter="filterHandle"
          />
        </div> -->
        <div class="col-md-6"></div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-6">
              <input
                class="form-control c-input"
                placeholder="filter by date"
                type="date"
                v-model="filterDate"
                @keydown.enter="filterHandle"
              />
            </div>
            <div class="col-md-6">
              <button class="btn btn-outline-light w-100" @click="resetFilter">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="table-responsive custom-table-responsive">
        <pagination
          :pages="pagination.pages"
          :currentPage="currentPage"
          :totalPages="pagination.totalPages"
          @changePage="changePage"
        ></pagination>
        <table class="table custom-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Exam</th>
              <th scope="col">Grade</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="r in reports" :key="r.id">
              <tr class="c-table-hover" scope="row">
                <td>{{ r.id }}</td>
                <td>
                  <span
                    style="cursor: pointer"
                    @click="filterByUserHandle(r.applicantId)"
                  >
                    {{
                      users.find((x) => x.userId === r.applicantId).user
                        ?.firstName
                    }}
                    {{
                      users.find((x) => x.userId === r.applicantId).user
                        ?.lastName
                    }}
                  </span>
                </td>
                <td>
                  <span
                    style="cursor: pointer"
                    @click="filterByExamHandle(r.examId)"
                  >
                    {{
                      exams.find((x) => x.examId === r.examId).exam?.title ||
                      r.examId
                    }}
                  </span>
                </td>
                <td>{{ r.grade || "-" }}</td>
                <td>{{ new Date(r.reportDate).toLocaleDateString() }}</td>
                <td>
                  <router-link
                    :to="{
                      name: 'ReportsDetails',
                      params: { idReport: r.id },
                    }"
                    >View</router-link
                  >
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

    <div class="d-flex justify-content-center" v-if="!reports">
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
import { ref, onMounted, getCurrentInstance } from "vue";
import reportService from "@/_services/reportService.js";
import examService from "@/_services/examService.js";
import userService from "@/_services/userService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;

    const { getAllReports } = reportService();
    const { getExamById } = examService();
    const { getUserById } = userService();

    const reports = ref(null);
    const users = ref([]);
    const exams = ref([]);

    const currentPage = ref(1);
    const pagination = ref({ pages: [1], totalPages: 1 });
    const pageSize = 15;

    const filterUser = ref(null);
    const filterExam = ref(null);
    const filterDate = ref(null);

    onMounted(async () => {
      getFilterFromStorage();

      await getData();
    });

    const getData = async () => {
      let filter = {};

      if (filterUser.value) {
        filter.user = filterUser.value;
      }
      if (filterExam.value) {
        filter.exam = filterExam.value;
      }
      if (filterDate.value) {
        filter.date = filterDate.value;
      }

      filterStorage();
      let response = await getAllReports(currentPage.value, pageSize, filter);

      if (response && response.value) {
        if (response.value.status === 200) {
          reports.value = response.value.data.items;

          pagination.value = {
            pages: response.value.data.pages,
            totalPages: response.value.data.totalPages,
          };

          //Get date of user By id

          for (const iterator of reports.value) {
            if (
              users.value.filter((x) => x.userId === iterator.applicantId)
                .length === 0
            ) {
              users.value.push({ userId: iterator.applicantId });
            }

            if (
              exams.value.filter((x) => x.examId === iterator.examId).length ===
              0
            ) {
              exams.value.push({ examId: iterator.examId });
            }
          }

          for (const iterator of users.value) {
            let res = await getUserById(iterator.userId);
            if (res && res.value) {
              if (res.value.status === 200) {
                iterator.user = res.value.data;
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

          for (const iterator of exams.value) {
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

    const changePage = async (page) => {
      if (page === currentPage.value) return;
      currentPage.value = page;

      await getData();
    };

    const filterHandle = async () => {
      currentPage.value = 1;
      await getData();
    };

    const filterByUserHandle = async (idUser) => {
      filterUser.value = idUser;

      await filterHandle();
    };

    const filterByExamHandle = async (idExam) => {
      filterExam.value = idExam;

      await filterHandle();
    };

    const resetFilter = async () => {
      filterUser.value = null;
      filterExam.value = null;
      filterDate.value = null;
      currentPage.value = 1;

      await filterHandle();
    };

    /**
     * Safe all filters to session storage
     */
    const filterStorage = () => {
      let filterObj = {};

      filterObj.user = filterUser.value;
      filterObj.exam = filterExam.value;
      filterObj.date = filterDate.value;
      filterObj.page = currentPage.value;

      sessionStorage.filterReports = JSON.stringify(filterObj);
    };

    /**
     * Get all filters from session storage
     */

    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem("filterReports");

      if (filter) {
        let filterObj = JSON.parse(filter);
        filterUser.value = filterObj.user ? filterObj.user : "";
        filterExam.value = filterObj.exam ? filterObj.exam : "";
        filterDate.value = filterObj.date ? filterObj.date : "";
        currentPage.value = filterObj.page ? filterObj.page : "";
      }
    };

    return {
      reports,
      users,
      exams,
      currentPage,
      pagination,
      filterUser,
      filterExam,
      filterDate,
      changePage,
      filterHandle,
      filterByUserHandle,
      filterByExamHandle,
      resetFilter,
    };
  },
};
</script>

<style scoped>
@import "../../../../assets/css/table.css";
</style>