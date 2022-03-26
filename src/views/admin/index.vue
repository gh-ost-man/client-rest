<template>
  <div class="text-white p-3">
    <div class="d-flex justify-content-left">
      <!-- <div class="text-center bg-danger ">
          <i><font-awesome-icon class="h-100" icon="user-secret"  /></i>
      </div> -->
      <div class="text-center" v-if="currentUser">
        <h3>{{ currentUser.firstName }} {{ currentUser.lastName }}</h3>
        <h5>{{ currentUser.email }}</h5>
        <h3>{{ currentUser.roles }}</h3>
      </div>
    </div>
    <hr class="mt-3" />
    <div class="row">
      <div
        class="col-md-4 mt-2"
        v-if="users && isVisibleHandle(['Manager', 'Admin'])"
      >
        <div class="card border-secondary bg-transparent  ">
          <div class="card-header border-secondary">
            Users
            <router-link
              :to="{ name: 'UsersList' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3 text-center">
              <div class="col-md-6 col-sm-6">
                <h4>Users</h4>
                <!-- <h2>{{ users.length }}</h2> -->
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <h2>{{ users.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-md-4 mt-2"
        v-if="exams && isVisibleHandle(['Manager', 'Teacher'])"
      >
        <div class="card border-secondary bg-transparent bg-dark">
          <div class="card-header border-secondary">
             Exams
            <router-link
              :to="{ name: 'ExamsList' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3 text-center">
              <div class="col-md-6 col-sm-6">
                <h4>Exams</h4>
                <!-- <h2>{{ exams.length }}</h2> -->
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <h2>{{ exams.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mt-2" v-if="reports && isVisibleHandle(['Manager'])">
        <div class="card border-secondary bg-transparent bg-dark">
          <div class="card-header border-secondary">
              Reports
            <router-link
              :to="{ name: 'ReportsList' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3 text-center">
              <div class="col-md-6 col-sm-6">
                <h4>Reports</h4>
                <!-- <h2>{{ reports.length }}</h2> -->
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <h2>{{ reports.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-md-4 mt-2"
        v-if="questions && isVisibleHandle(['Teacher'])"
      >
        <div class="card border-secondary bg-transparent bg-dark">
          <div class="card-header border-secondary">
            Questions
            <router-link
              :to="{ name: 'QuestionsList' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3 text-center">
              <div class="col-md-6 col-sm-6">
                <h4>Questions</h4>
                <!-- <h2>{{ questions.length }}</h2> -->
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <h2>{{ questions.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="col-md-4 mt-2"
        v-if="categories && isVisibleHandle(['Teacher'])"
      >
        <div class="card border-secondary bg-transparent bg-dark">
          <div class="card-header border-secondary">
             Categories
            <router-link
              :to="{ name: 'CategoriesList' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3 text-center">
              <div class="col-md-6 col-sm-6">
                <h4>Categories</h4>
                <!-- <h2>{{ categories.length }}</h2> -->
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <h2>{{ categories.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from "@/_services/authService.js";
import examService from "@/_services/examService.js";
import userService from "@/_services/userService.js";
import questionService from "@/_services/questionService.js";
import categoryService from "@/_services/categoryService.js";
import reportService from "@/_services/reportService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { onMounted, ref, getCurrentInstance } from "vue";

export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;

    const users = ref(null);
    const exams = ref(null);
    const reports = ref(null);
    const questions = ref(null);
    const categories = ref(null);

    const { currentUser } = authService();
    const { getAllUsers } = userService();
    const { getAllExams } = examService();
    const { getAllReports } = reportService();
    const { getAllQuestions } = questionService();
    const { getAllCategories } = categoryService();

    onMounted(async () => {
      if (isVisibleHandle(["Manager", "Admin"])) {
        let resUsers = await getAllUsers();

        if (resUsers.value) {
          if (resUsers.value.status === 200) {
            users.value = resUsers.value.data.items;
          } else {
            handleResponse(resUsers.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }

      if (isVisibleHandle(["Manager", "Teacher"])) {
        let resExams = await getAllExams();

        if (resExams.value) {
          if (resExams.value && resExams.value.status === 200) {
            exams.value = resExams.value.data.items;
          } else {
            handleResponse(resExams.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }

      if (isVisibleHandle(["Manager"])) {
        let resReports = await getAllReports();

        if (resReports.value) {
          if (resReports.value.status === 200) {
            reports.value = resReports.value.data.items;
          } else {
            handleResponse(resReports.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }

      if (isVisibleHandle(["Teacher"])) {
        let resQuestions = await getAllQuestions();

        if (resQuestions.value) {
          if (resQuestions.value.status === 200) {
            questions.value = resQuestions.value.data.items;
          } else {
            handleResponse(resQuestions.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }

      if (isVisibleHandle(["Teacher"])) {
        let resCategory = await getAllCategories();
        if (resCategory.value) {
          if (resCategory.value.status === 200) {
            categories.value = resCategory.value.data.items;
          } else {
            handleResponse(resCategory.value).forEach((element) => {
              toast.error(element, {
                position: "top",
                duration: 5000,
              });
            });
          }
        }
      }
    });

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
      currentUser,
      users,
      exams,
      reports,
      questions,
      categories,
      isVisibleHandle,
    };
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Audiowide&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Audiowide&family=Iceland&display=swap");

* {
  font-family: "Audiowide", sans-serif;
}


/* body {
  overflow: hidden;
  background-color: #232526;
} */

/* .text-animation {
  position: absolute;
  top: 24%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  font-family: "Audiowide", sans-serif;
  color: rgb(240, 240, 240);
  font-size: 28px;
} */

/* .text-animation span {
  position: relative;
  opacity: 0;
  animation: textAnimation 2s ease-in-out forwards;
} */

/* @keyframes textAnimation {
  to {
    top: 0;
    left: 0;
    opacity: 1;
  }
} */
/* 
hr {
  position: relative;
  border: 0.7px solid rgb(0, 87, 102);
  left: 50%;
  width: 100%;
  animation: lineAnimation 1.1s ease-in-out forwards;
  animation-delay: 1.4s;
  opacity: 0;
    overflow: hidden;

} */

/* @keyframes lineAnimation {
  to {
    top: 0;
    left: 0;
    opacity: 1;
  }
} */

/* .text-createby {
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 30px;
  left: 10%;
  width: 80%;
  font-family: "Audiowide", sans-serif;
  font-size: 14px;
  color: rgb(104, 104, 104);
  animation: createbyAnimation 1.2s ease-in-out forwards;
  animation-delay: 1.4s;
  opacity: 0;
} */
/* 
@keyframes createbyAnimation {
  to {
    opacity: 1;
  }
} */

/* .text-logoAnimation{

    position: absolute;
    top: 40%;
    text-align: center;
    width: 100%;
    font-family: "Audiowide", sans-serif;
    color: rgb(27, 27, 27);
    font-size: 90px;
} */
</style>