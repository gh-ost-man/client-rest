<template>
  <div class="sidebar" :class="{ close: isClosedSideBar }">
    <div class="logo-details c-logo text-center">
      <i @click="$router.push({ name: 'HomeAdmin' })">
        <font-awesome-icon icon="user-secret" class="fs-1"
      /></i>
      <span @click="$router.push({ name: 'HomeAdmin' })" class="logo_name fs-3"
        >IT STEP</span
      >
    </div>
    <ul class="nav-links">
      <li
        v-if="isVisibleHandle(['Admin', 'Manager', 'Teacher'])"
        :class="{ 'menu-active': $route.fullPath.includes('profile') }"
      >
        <router-link :to="{ name: 'ProfileAdmin' }">
          <i><font-awesome-icon icon="circle-user" /></i>
          <span class="link_name">Profile</span>
        </router-link>
        <ul class="sub-menu blank">
          <li>
            <router-link :to="{ name: 'ProfileAdmin' }">Profile</router-link>
          </li>
        </ul>
      </li>
      <li v-if="isVisibleHandle(['Admin', 'Manager'])">
        <router-link
          :to="{ name: 'UsersList' }"
          :class="{ 'menu-active': $route.fullPath.includes('users') }"
        >
          <i> <font-awesome-icon icon="users" /></i>
          <span class="link_name">Users</span>
        </router-link>

        <ul class="sub-menu blank">
          <li>
            <router-link :to="{ name: 'UsersList' }">Users</router-link>
          </li>
        </ul>
      </li>
      <li
        v-if="isVisibleHandle(['Teacher', 'Manager'])"
        :class="{
          showMenu: showSubExamMenu,
          'menu-active':
            $route.fullPath.includes('exams') ||
            $route.fullPath.includes('categories') ||
            $route.fullPath.includes('questions'),
        }"
      >
        <div class="iocn-link">
          <router-link
            class="w-100"
            :to="{ name: 'ExamsList' }"
            :class="{ 'menu-active': $route.fullPath.includes('exams') }"
          >
            <i class=""> <font-awesome-icon icon="graduation-cap" /></i>
            <span class="link_name">Exams</span>
          </router-link>
          <i class="arrow" @click="showSubExamMenu = !showSubExamMenu" v-if="isVisibleHandle(['Teacher'])">
            <font-awesome-icon icon="angle-down" />
          </i>
        </div>
        <ul class="sub-menu">
          <li v-if="isVisibleHandle(['Teacher', 'Manager'])">
            <router-link :to="{ name: 'ExamsList' }">Exams</router-link>
          </li>
          <li v-if="isVisibleHandle(['Teacher'])">
            <router-link :to="{ name: 'CategoriesList' }">
              Categories
            </router-link>
          </li>
          <li v-if="isVisibleHandle(['Teacher'])">
            <router-link :to="{ name: 'QuestionsList' }">
              Questions
            </router-link>
          </li>
        </ul>
      </li>
      <li
        v-if="isVisibleHandle(['Manager'])"
        :class="{
          showMenu: showSubReportMenu,
          'menu-active': $route.fullPath.includes('reports'),
        }"
      >
        <div class="iocn-link">
          <router-link
            class="w-100"
            :to="{ name: 'ReportsList' }"
            :class="{ 'menu-active': $route.fullPath.includes('reports') }"
          >
            <i> <font-awesome-icon icon="clipboard-list" /></i>
            <span class="link_name">Reports</span>
          </router-link>
          <i class="arrow" @click="showSubReportMenu = !showSubReportMenu">
            <font-awesome-icon icon="angle-down" />
          </i>
        </div>
        <ul class="sub-menu">
          <li>
            <router-link :to="{ name: 'ReportsList' }"> Reports </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'ReportsByExamList' }">
              Reports by exam
            </router-link>
          </li>
        </ul>
      </li>
      <!-- <li v-if="isVisibleHandle(['Manager'])">
        <router-link :to="{ name: 'ReportsList' }">
          <i> <font-awesome-icon icon="clipboard-list" /></i>
          <span class="link_name">Reports</span>
        </router-link>
        <i class="arrow" @click="showSubReportMenu = !showSubReportMenu">
          <font-awesome-icon icon="angle-down" />
        </i>
        <ul class="sub-menu blank">
          <li>
            <router-link :to="{ name: 'ReportsList' }"> Reports </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'ReportsByExamList' }">
              Reports by exam
            </router-link>
          </li>
        </ul>
      </li> -->
      <li v-if="isVisibleHandle(['Manager', 'Admin', 'Teacher'])">
        <div class="profile-details">
          <div class="profile-content">
            <!-- <img src="image/profile.jpg" alt="profileImg" /> -->
          </div>
          <div class="name-job">
            <div class="profile_name truncate-text">
              {{ $store.state.auth.user?.firstName }}
              {{ $store.state.auth.user?.lastName }}
            </div>
            <div class="job">{{ $store.state.auth.user?.email }}</div>
          </div>
          <i @click="logout">
            <font-awesome-icon icon="arrow-right-from-bracket"
          /></i>
        </div>
        <div class="logout" v-if="isClosedSideBar">
          <a @click="logout">
            <i> <font-awesome-icon icon="arrow-right-from-bracket" /></i>
          </a>
        </div>
      </li>
    </ul>
  </div>
  <section class="home-section body-background">
    <div class="home-content c-background sticky-top text-white">
      <i
        class="mx-3 fs-4"
        style="cursor: pointer"
        @click="isClosedSideBar = !isClosedSideBar"
      >
        <font-awesome-icon icon="bars" />
      </i>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import authService from "@/_services/authService.js";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { encryptData, decryptData } from "../_helpers/crypto";
import { useStore } from "vuex";

export default {
  name: "admin-layout",
  data() {
    return {
      showSubExamMenu: false,
      showSubReportMenu: false,
    };
  },
  setup() {
    const isClosedSideBar = ref(true);
    const authEmail = ref(null);
    const authFullName = ref(null);
    const { logOut, currentUser } = authService();
    const router = useRouter();
    const store = useStore();

    if (currentUser?.value) {
      authEmail.value = currentUser.value.email;
      authFullName.value =
        currentUser.value.firstName + " " + currentUser.value.lastName;
    }

    const logout = () => {
      console.log("click");
      logOut();

      router.push({ name: "Login" });
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
      isClosedSideBar,
      authEmail,
      authFullName,
      logout,
      isVisibleHandle,
    };
  },
};
</script>

<style scopped>
.c-background {
  background: rgba(0, 0, 0, 0.9);
}

.c-logo {
  -webkit-box-reflect: below -30px linear-gradient(transparent, #0004);
  color: #fff;
  text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
    0 0 80px #03bcf4, 0 0 160px #03bcf4, 0 0 400px #03bcf4;
}

/* .c-logo span {
  animation:  animate 5s linear infinite;
} */

/* @keyframes animate {
    0%, 18%, 50.1%, 60%, 65.1%, 80%, 90.1%, 92%{
        color: #0e3742 !important;
        text-shadow: none;
    }
    18.1%, 20.1%,30%,50%, 60.1%, 65%,80.1%, 90%, 92.1%, 100% {
        color:#fff;
        text-shadow:
        0 0 10px #03bcf4,
        0 0 20px #03bcf4,
        0 0 40px #03bcf4,
        0 0 80px #03bcf4,
        0 0 160px #03bcf4,
        0 0 400px #03bcf4;
    }
} */

.menu-active {
  /* background:  darkcyan;; */
  /* -webkit-box-reflect: below -30px linear-gradient(transparent, #0004); */
  /* color: #fff;
  text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
    0 0 80px #03bcf4, 0 0 160px #03bcf4, 0 0 400px #03bcf4; */

  /* background: darkcyan; */
  background: #2b2b2b;
}
/* Google Fonts Import Link */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.logout {
  position: fixed;
  bottom: 0;
  /* width: 260px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  transition: all 0.3s ease;
}

.name-job {
  color: white;
  width: 200px;
  padding: 1rem;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  /* background: #11101d; */
  background: #191919;
  z-index: 100;
  transition: all 0.5s ease;
}
.sidebar.close {
  width: 78px;
}
.sidebar .logo-details {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
}
.sidebar .logo-details i {
  font-size: 30px;
  color: #fff;
  height: 50px;
  min-width: 78px;
  text-align: center;
  line-height: 50px;
}
.sidebar .logo-details .logo_name {
  font-size: 22px;
  color: #fff;
  font-weight: 600;
  transition: 0.3s ease;
  transition-delay: 0.01s;
}
.sidebar.close .logo-details .logo_name {
  transition-delay: 0s;
  opacity: 0;
  pointer-events: none;
}
.sidebar .nav-links {
  height: 100%;
  padding: 30px 0 150px 0;
  overflow: auto;
}
.sidebar.close .nav-links {
  overflow: visible;
}
.sidebar .nav-links::-webkit-scrollbar {
  display: none;
}
.sidebar .nav-links li {
  position: relative;
  list-style: none;
  transition: all 0.4s ease;
}

.sidebar .nav-links li .iocn-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar.close .nav-links li .iocn-link {
  display: block;
}
.sidebar .nav-links li i {
  height: 50px;
  min-width: 78px;
  text-align: center;
  line-height: 50px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.sidebar .nav-links li.showMenu i.arrow {
  transform: rotate(-180deg);
}
.sidebar.close .nav-links i.arrow {
  display: none;
}
.sidebar .nav-links li a {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.sidebar .nav-links li a .link_name {
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  transition: all 0.4s ease;
}
.sidebar.close .nav-links li a .link_name {
  opacity: 0;
  pointer-events: none;
}
.sidebar .nav-links li .sub-menu {
  padding: 6px 6px 14px 80px;
  margin-top: -10px;
  /* background: #1d1b31; */
  /* background: darkcyan; */
  background: #2b2b2b;
  display: none;
}

.sidebar .nav-links li.showMenu .sub-menu {
  display: block;
}
.sidebar .nav-links li .sub-menu a {
  color: #fff;
  font-size: 15px;
  padding: 5px 0;
  white-space: nowrap;
  opacity: 0.6;
  transition: all 0.3s ease;
}
.sidebar .nav-links li .sub-menu a:hover {
  opacity: 1;
}
.sidebar.close .nav-links li .sub-menu {
  position: absolute;
  left: 100%;
  top: -10px;
  margin-top: 0;
  padding: 10px 20px;
  border-radius: 0 6px 6px 0;
  opacity: 0;
  display: block;
  pointer-events: none;
  transition: 0s;
}
.sidebar.close .nav-links li:hover .sub-menu {
  top: 0;
  opacity: 1;
  pointer-events: auto;
  transition: all 0.4s ease;
}
.sidebar .nav-links li .sub-menu .link_name {
  display: none;
}
.sidebar.close .nav-links li .sub-menu .link_name {
  font-size: 18px;
  opacity: 1;
  display: block;
}
.sidebar .nav-links li .sub-menu.blank {
  opacity: 1;
  pointer-events: auto;
  padding: 3px 20px 6px 16px;
  opacity: 0;
  pointer-events: none;
}
.sidebar .nav-links li:hover .sub-menu.blank {
  top: 50%;
  transform: translateY(-50%);
}
.sidebar .profile-details {
  position: fixed;
  bottom: 0;
  width: 260px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* background: #1d1b31; */
  background: #2b2b2b;
  padding: 12px 0;
  transition: all 0.3s ease;
}
.sidebar.close .profile-details {
  background: none;
}
.sidebar.close .profile-details {
  width: 78px;
}
.sidebar .profile-details .profile-content {
  display: flex;
  align-items: center;
}
.sidebar .profile-details img {
  height: 52px;
  width: 52px;
  object-fit: cover;
  border-radius: 16px;
  margin: 0 14px 0 12px;
  background: #1d1b31;
  transition: all 0.5s ease;
}
.sidebar.close .profile-details img {
  padding: 10px;
}
.sidebar .profile-details .profile_name .sidebar .profile-details .job {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
}
.sidebar.close .profile-details i,
.sidebar.close .profile-details .profile_name,
.sidebar.close .profile-details .job {
  display: none;
}
.sidebar .profile-details .job {
  font-size: 12px;
}
.home-section {
  position: relative;
  height: 100vh;
  left: 260px;
  width: calc(100% - 260px);
  transition: all 0.5s ease;
}
.sidebar.close ~ .home-section {
  left: 78px;
  width: calc(100% - 78px);
}
.home-section .home-content {
  height: 60px;
  display: flex;
  align-items: center;
  background: #191919;
}
.home-section .home-content .bx-menu,
.home-section .home-content .text {
  color: #11101d;
  font-size: 35px;
}
.home-section .home-content .bx-menu {
  margin: 0 15px;
  cursor: pointer;
}
.home-section .home-content .text {
  font-size: 26px;
  font-weight: 600;
}
@media (max-width: 420px) {
  .sidebar.close .nav-links li .sub-menu {
    display: none;
  }
}

.truncate-text {
  overflow: hidden !important;
  display: -webkit-box;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical;
}
</style>