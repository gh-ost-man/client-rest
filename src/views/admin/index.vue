<template>
  <div class="text-white p-3">
    <!-- <div class="d-flex justify-content-left">
      <div class="text-center" v-if="currentUser">
        <h3>{{ currentUser.firstName }} {{ currentUser.lastName }}</h3>
        <h5>{{ currentUser.email }}</h5>
        <h3>{{ currentUser.roles }}</h3>
      </div>
    </div> -->
    <!-- <hr class="mt-3" />
    <div class="row d-flex">
      <div
        class="col-md-4 mt-2"
        v-if="users && isVisibleHandle(['Manager', 'Admin'])"
      >
        <div class="card border-secondary bg-transparent">
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
                <p>Users</p>
             
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <p>{{ users.length }}</p>
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
                <p>Exams</p>
             
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <p>{{ exams.length }}</p>
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
                <p>Reports</p>
            
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <p>{{ reports.length }}</p>
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
                <p>Questions</p>
          
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <p>{{ questions.length }}</p>
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
                <p>Categories</p>
           
              </div>
              <div class="col-md-6 col-sm-6">
                <div class="text-center">
                  <p>{{ categories.length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <div class="body">
      <div v-if="isVisibleHandle(['Manager', 'Admin', 'Teacher'])">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'ProfileAdmin' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="user-circle"
                    /></i>
                  </h1>
                  <h2 class="text-info ">Profile</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary">
                    In this card you can view and manage your profile
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="users && isVisibleHandle(['Manager', 'Admin'])">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'UsersList' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"><font-awesome-icon icon="users" /> </i>
                  </h1>
                  <h2 class="text-info">Users</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary">
                    In this card you can view and manage existing users and his
                    roles
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="reports && isVisibleHandle(['Manager'])">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'ReportsList' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="clipboard-list"
                    /></i>
                  </h1>
                  <h2 class="text-info">Reports</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary">
                    Report card give you all information about exam and
                    applicant results.
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="exams && isVisibleHandle(['Manager', 'Teacher'])">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'ExamsList' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="graduation-cap"
                    /></i>
                  </h1>
                  <h2 class="text-info">Exams</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary">
                    In this card you have ability to view, create and manage
                    exams.
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="questions && isVisibleHandle(['Teacher'])">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'QuestionsList' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="graduation-cap"
                    /></i>
                  </h1>
                  <h2 class="text-info">Questions</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary">
                    In this card you have ability to adding, creating, removing
                    and managing questions.
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="categories && isVisibleHandle(['Teacher'])">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'CategoriesList' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="graduation-cap"
                    /></i>
                  </h1>
                  <h2 class="text-info">Categories</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary">
                    Category card give you the information about exist
                    categories in application
                  </p>
                </div>
              </div>
            </router-link>
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
.author-list-item {
  display: inline-block;
  margin-right: 10px;
}
.author-list-enter-active,
.author-list-leave-active {
  transition: all 0.4s ease;
}
.author-list-enter-from,
.author-list-leave-to {
  opacity: 0;
  transform: translateX(130px);
}

.author-list-move {
  transition: transform 0.4s ease;
}

@import url("https://fonts.googleapis.com/css2?family=Audiowide&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Audiowide&family=Iceland&display=swap");

* {
  font-family: "Audiowide", sans-serif;
}

@import url("https://fonts.googleapis.com/css2?family=Jaldi:wght@400;700&&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.container-card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 30px 0;
}
.card {
  background-color: #232427;
}
.container-card .card {
  position: relative;
  min-width: 280px;
  height: 390px;
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin: 30px;
}
.container-card .card .box {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: transparent;
  border: 2px solid #2a2b2f;
  border-radius: 15px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  word-wrap: break-word;
}
.container-card .card .box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 190%;
  /* background: rgba(23, 23, 23, 0.1); */
  pointer-events: none;
}
.container-card .card .box:hover {
  transform: translateY(-50px);
  /* box-shadow: 0 40px 70px rgba(0, 0, 0, 0.05); */
  box-shadow: cyan;
}
.container-card .card .box .content {
  padding: 20px;
  text-align: justify;
}
.container-card .card .box .content h2 {
  /* position: absolute; */
  text-align: center;
  margin-top: 5%;
  /* top: 20px; */
  /* right: 20px; */
  font-size: 1.7em;
  /* color: rgba(0, 174, 255, 0.176); */
  color: darkcyan !important;
}
.container-card .card .box .content h3 {
  font-size: 1.3em;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  transition: 0.5s;
  padding-top: 65px;
}
.container-card .card .box .content p {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  transition: 0.5s;
}

.text-body {
  position: absolute;
}
</style>