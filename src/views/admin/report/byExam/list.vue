<template>
  <div class="p-3">
     <h3 class="text-white">Reports by exam</h3>
      <hr class="bg-info" />
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
            <th scope="col">#</th>
            <th scope="col">Title</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="re in reportsExam" :key="re.id">
            <tr class="c-table-hover" scope="row">
              <td>{{ re.id }}</td>
              <td>{{ re.title }}</td>
              <td>
                <router-link
                  :to="{
                    name: 'ReportByExamDetails',
                    params: { idExam: re.id },
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
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import reportService from "@/_services/reportService.js";
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;

    const { getAllReports } = reportService();
    const { getAllExams, getExamById } = examService();

    const reports = ref(null);
    const reportsExam = ref(null);

   

    onMounted(async () => {
      let response = await getAllReports();

      if (response && response.value) {
        if (response.value.status === 200) {
          reports.value = response.value.data.items;
          reportsExam.value = [];
          console.log(reports.value);

          for (const iterator of reports.value) {
             if (
              reportsExam.value.filter((x) => x.id === iterator.examId).length === 0
            ) {
               let res = await getExamById(iterator.examId);
              if (res && res.value) {
                if (res.value.status === 200) {
                  reportsExam.value.push(res.value.data);
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
          }
          // await reports.value.reduce(async (a, item) => {
          //   let res = await getExamById(item.examId);
          //   if (
          //     reportsExam.value.filter((x) => x.id === item.examId).length === 0
          //   ) {
          //     if (res && res.value) {
          //       if (res.value.status === 200) {
          //         reportsExam.value.push(res.value.data);
          //       } else {
          //         handleResponse(res.value).forEach((element) => {
          //           toast.error(element, {
          //             position: "top",
          //             duration: 5000,
          //           });
          //         });
          //       }
          //     }
          //   }
          // }, Promise.resolve());
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

    return { reports, reportsExam };
  },
};
</script>

<style scoped>
@import "../../../../assets/css/table.css";
</style>