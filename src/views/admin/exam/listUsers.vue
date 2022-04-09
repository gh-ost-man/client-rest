<template>
  <div class="p-3">
    <router-link :to="{ name: 'ExamsList' }" class="btn btn-outline-info">
      <i><font-awesome-icon icon="circle-arrow-left" /></i>
    </router-link>
    <div class="table-responsive custom-table-responsive mt-3" v-if="examUsers">
      <h3 class="text-white">Applicants</h3>
      <hr class="bg-secondary" />
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
            <th scope="col">Full name</th>
            <th scope="col">Email</th>
            <th scope="col">Exam</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="eu in examUsers" :key="eu.user.id">
            <tr class="c-table-hover" scope="row">
              <td>{{ eu.user.id }}</td>
              <td>{{ eu.user.firstName }} {{ eu.user.lastName }}</td>
              <td>{{ eu.user.email }}</td>
              <td>{{ exam.title || eu.examId }}</td>
              <td></td>
            </tr>
            <tr class="spacer">
              <td colspan="100"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center" v-if="!examUsers">
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
import handleResponse from "@/_helpers/handleResponse.js";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: ["id"],
  setup(props) {
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;

    const exam = ref(null);
    const examUsers = ref(null);

    const { getExamById } = examService();
    const { getExamUsers } = userService();

    const pagination = ref({ pages: [1], totalPages: 1 });
    const pageSize = 15;
    const currentPage = ref(1);
    const middleVal = ref(10);
    const cntBetween = ref(5);

    onMounted(async () => {
      let resExam = await getExamById(props.id);

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

      await getData();
    });

    const getData = async () => {
      let resUsers = await getExamUsers(props.id, currentPage.value, pageSize);
      if (resUsers && resUsers.value) {
        if (resUsers.value.status === 200) {
          examUsers.value = resUsers.value.data.items;

          pagination.value = {
            pages: resUsers.value.data.pages,
            totalPages: resUsers.value.data.totalPages,
          };
        } else {
          handleResponse(resUsers.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    /**
     * Changes current page
     *
     * @param {number} pag New page
     */
    const changePage = async (pag) => {
      currentPage.value = pag;

      await getData();
    };

    return { exam, examUsers, pagination, currentPage, middleVal, changePage };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>