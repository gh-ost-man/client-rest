<template>
  <div class="p-3">
    <h3 class="text-white">Result</h3>
    <hr class="bg-info" />
    <div class="text-white" v-if="exam && currentUser && report">
      <p>User: {{ currentUser.firstName }} {{ currentUser.lastName }}</p>
      <p>Exam: {{ exam.title }}</p>
      <p>GRADE: {{ report.grade }}</p>
      <p>Date: {{ new Date(report.reportDate).toLocaleDateString( )  }}</p>
    </div>
    <div class="d-flex justify-content-center" v-if="!report">
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
import reportService from "@/_services/reportService.js";
import examService from "@/_services/examService.js";
import authService from "@/_services/authService.js";
import { onMounted, ref, computed, getCurrentInstance, onUnmounted } from "vue";

export default {
  props: ["idReport"],
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;
    const report = ref(null);
    const exam = ref(null);

    const { getReportById } = reportService();
    const { currentUser } = authService();
    const { getExamById } = examService();

    onMounted(async () => {
      let response = await getReportById(props.idReport);

      if (response && response.value) {
        if (response.value.status === 200) {
          report.value = response.value.data;
          console.log(report.value);

          let resExam = await getExamById(report.value.examId);

          if (resExam && resExam.value) {
            if (resExam.value.status === 200) {
              exam.value = resExam.value.data;
            } else {
              handleResponse(resExam.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
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
    });

    return { report, exam, currentUser };
  },
};
</script>

<style>
</style>