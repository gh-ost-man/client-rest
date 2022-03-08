<template>
  <div class="p-3">
    <div class="table-responsive custom-table-responsive" v-if="reports">
      <!-- <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          :totalPages="paggination.totalPages"
          @changePage="changePage"
        ></paggination> -->
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col">Exam</th>
            <th class="text-center" scope="col">Grage</th>
            <th class="text-center" scope="col">Date</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="r in reports" :key="r.id">
            <tr scope="row">
              <td>{{ r.exam?.title }}</td>
              <td class="text-center">{{ r.grade }}</td>
              <td class="text-center">{{ new Date(r.reportDate).toLocaleDateString() }}</td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
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
import reportService from "@/_services/reportService.js";
import authService from "@/_services/authService.js";
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { ref, getCurrentInstance, onMounted } from "vue";
export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;

    const { getReportsByUserId } = reportService();
    const { currentUser } = authService();
    const { getExamById } = examService();

    const reports = ref(null);

    onMounted(async () => {
      let response = await getReportsByUserId(currentUser.value.id);

      if (response && response.value) {
        if (response.value.status === 200) {
          console.log(response.value);
          reports.value = response.value.data;

          await reports.value.reduce(async (a, item) => {
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
    });

    return { reports };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>