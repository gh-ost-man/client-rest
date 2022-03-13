<template>
  <div class="p-3">
    <div class="table-responsive custom-table-responsive" v-if="exams">
      <table class="table custom-table">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">DurationTime</th>
            <th scope="col">PassingScore</th>
            <th scope="col">Qty of questions</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="exam in exams" :key="exam.id">
            <tr scope="row" class="c-table-hover">
              <td>{{ exam.title }}</td>
              <td>{{ exam.durationTime }}</td>
              <td>{{ exam.passingScore }}</td>
              <td>{{ exam.qtyOfQuestions }}</td>
              <td>
                <router-link class="btn btn-outline-light btn-pass" :to="{name: 'PassExamStudent', params: {idExam: exam.id}}">Pass</router-link>
              </td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
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
import userService from "@/_services/userService.js";
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";

export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const { currentUser } = authService();
    const { getExamById, getAllExamQuestions } = examService();
    const { getUserExams } = userService();
    const exams = ref(null);
    const userExams = ref(null);

    onMounted(async () => {
      let response = await getUserExams(currentUser.value.id);

      if (response && response.value) {
        if (response.value.status === 200) {
          userExams.value = response.value.data.items;
          exams.value = [];

          await userExams.value.reduce(async (a, item) => {
            let res = await getExamById(item.examId);

            if (res && res.value) {
              if (res.value.status === 200) {
                let exam = res.value.data;
                let resQ = await getAllExamQuestions(exam.id);

                if (resQ && resQ.value) {
                  if (resQ.value.status === 200) {
                    exam.qtyOfQuestions = resQ.value.data.items.length;
                  } else {
                    handleResponse(resQ.value).forEach((element) => {
                      toast.error(element, {
                        position: "top",
                        duration: 5000,
                      });
                    });
                  }
                }

                exams.value.push(exam);
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

    return { exams };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
.btn-pass:hover {
  color:black;
}

</style>