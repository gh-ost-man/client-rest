<template>
  <div class="sidebar" :class="{ close: isClosedSideBar }">
    <div class="logo-details c-logo">
      <span> <i class="fa-solid fa-user-secret fs-1"></i></span>
      <span class="logo_name fs-3">IT STEP</span>
    </div>
    <ul class="nav-links">
         <li>
        <!-- <a href="#">
          <i class="bx bx-compass"></i>
          <span class="link_name">Profile</span>
        </a> -->
        <!-- <p class="text-white">{{$router.currentRoute}}</p> -->
        <p class="text-white">{{}}</p>
        <router-link :to="{ name: 'ProfileAdmin' }" :class="{'menu-active': $route.fullPath.includes('profile')}">
          <i class="fa-solid fa-circle-user"></i>
          <span class="link_name">Profile</span>
        </router-link>

        <ul class="sub-menu blank">
          <li>
            <!-- <a class="link_name" href="#">Profile</a> -->
            <router-link :to="{ name: 'ProfileAdmin' }">Profile</router-link>
          </li>
        </ul>
      </li>
      <li>
        <router-link :to="{ name: 'UsersList' }" :class="{'menu-active': $route.fullPath.includes('users')}">
          <i class="fas fa-users"></i>
          <span class="link_name">Users</span>
        </router-link>
        <!-- <a href="/users">
          <i class="fa-solid fa-users"></i>
          <span class="link_name">Users</span>
        </a> -->
        <ul class="sub-menu blank">
          <li>
            <!-- <a class="link_name" href="/users">Users</a> -->
            <router-link :to="{ name: 'UsersList' }">Users</router-link>
          </li>
        </ul>
      </li>
      <li :class="{ showMenu: showSubMenuService }">
        <div class="iocn-link">
          <!-- <a href="#">
           <i class="fa-solid fa-graduation-cap"></i>
            <span class="link_name">Tests</span>
          </a> -->
          <router-link :to="{name: 'ExamsList'}" :class="{'menu-active': $route.fullPath.includes('exams')}">
             <i class="fa-solid fa-graduation-cap"></i>
            <span class="link_name">Exams</span>
          </router-link>

          <!-- <i
            class="bx bxs-chevron-down arrow"
            @click="showSubMenuService = !showSubMenuService"
          ></i> -->
          <i class="fa-solid fa-angle-down arrow"  @click="showSubMenuService = !showSubMenuService"></i>
        </div>
        <ul class="sub-menu">
          <li><router-link :to="{name: 'ExamsList'}">Exams</router-link></li>
          <li>
            <!-- <a href="#">Categories</a> -->
            <router-link :to="{ name: 'CategoriesList' }">
              Categories
            </router-link>
          </li>
          <li>
             <router-link :to="{ name: 'QuestionsList' }">
              Questions
            </router-link>
          </li>
          <!-- <li><a href="#">Answers</a></li> -->
        </ul>
      </li>
      <li>
        <a href="#">
          <i class="fa-solid fa-clipboard-list"></i>
          <span class="link_name">Report</span>
        </a>
        <ul class="sub-menu blank">
          <li><a class="link_name" href="#">Report</a></li>
        </ul>
      </li>
      <li>
        <div class="profile-details">
          <div class="profile-content">
            <!-- <img src="image/profile.jpg" alt="profileImg" /> -->
           
          </div>
          <div class="name-job">
            <div class="profile_name truncate-text">{{ authFullName }}</div>
            <div class="job">{{ authEmail }}</div>
          </div>
          <!-- <i class="bx bx-log-out" @click="logout"></i> -->
          <i class="fa-solid fa-arrow-right-from-bracket" @click="logout"></i>
          <!-- <div class="name-job">
          <div class="profile_name truncate-text">Hello world asdj kajdl jaskl;dj klasdkl </div>
        </div> -->
        </div>
        <div class="logout" v-if="isClosedSideBar">
          <a @click="logout"><i class="fa-solid fa-arrow-right-from-bracket"></i></a>
        </div>
      </li>
    </ul>
  </div>
  <section class="home-section body-background">
    <div class="home-content c-background sticky-top text-white" >
      <!-- <i
        class="bx bx-menu text-white"
        @click="isClosedSideBar = !isClosedSideBar"
      ></i> -->
      <i class="fa-solid fa-bars mx-3 fs-4" style="cursor:pointer;"  @click="isClosedSideBar = !isClosedSideBar"></i>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import authService from "@/_services/authService.js";
import { computed, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "admin-layout",
  data() {
    return {
      showSubMenuService: false,
    };
  },
  setup() {
    const isClosedSideBar = ref(true);
    const authEmail = ref(null);
    const authFullName = ref(null);
    const { logOut } = authService();
    const router = useRouter();

    if (localStorage.user) {
      let user = JSON.parse(localStorage.user);

      authEmail.value = user.email;
      authFullName.value = user.firstName + " " + user.lastName;
    }

    const logout = () => {
      console.log("click");
      logOut();

      router.push({ name: "Login" });
    };

    return { isClosedSideBar, authEmail, authFullName, logout };
  },
};
</script>

<style scopped>

.c-background {
  background: rgba(0, 0, 0, 0.9);
}

.c-logo {
  -webkit-box-reflect: below -30px linear-gradient(transparent, #0004);
 color:#fff;
        text-shadow:  0 0 10px #03bcf4,
        0 0 20px #03bcf4,
        0 0 40px #03bcf4,
        0 0 80px #03bcf4,
        0 0 160px #03bcf4,
        0 0 400px #03bcf4;
}

.c-logo span {
  animation:  animate 5s linear infinite;
}

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
 color:#fff;
        text-shadow:  0 0 10px #03bcf4,
        0 0 20px #03bcf4,
        0 0 40px #03bcf4,
        0 0 80px #03bcf4,
        0 0 160px #03bcf4,
        0 0 400px #03bcf4;
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