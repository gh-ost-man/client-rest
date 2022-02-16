<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5">Users</h2>
      <hr class="bg-secondary" />
      <div>
        <router-link class="btn btn-outline-light" :to="{ name: 'CreateUser' }"
          >Create</router-link
        >
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive" v-if="users">
        <paggination :pages="paggination.pages" :currentPage="currentPage" @changePage="changePage" v-if="paggination.pages.length > 1"></paggination>
        <table class="table custom-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Email</th>
              <th scope="col">Full name</th>
              <th scope="col">CreatedAt</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="user in usersItems" :key="user.id">
              <tr scope="row">
                <td>{{ user.id }}</td>
                <td>{{ user.email }}</td>
                <td>
                  {{ user.firstName }} {{ user.lastName }}
                  <small class="d-block">
                    {{ user.roles }}
                  </small>
                </td>
                <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-light"
                    :to="{ name: 'EditUser', params: { id: user.id } }"
                  >
                    <i class="fa-solid fa-pen-to-square icon"></i>
                  </router-link>
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
    <div class="d-flex justify-content-center" v-if="!users">
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
import { useRouter } from "vue-router";
import usersService from "@/_services/userService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Paggination from "@/components/Paggination";

export default {
  components: {Paggination},
  setup() {
    const error = ref(null);
    const users = ref(null);
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getAllUsers } = usersService();
    const currentPage = ref(1);
    const pageSize = 15;

    const paggination = ref(null);

    onMounted(async () => {
      var response = await getAllUsers();

      if (response && response.value) {
        if (response.value.status === 200) {
          users.value = response.value.data;

          currentPage.value = 1;
          paggination.value = paginate(users.value.length, currentPage.value, pageSize);
        } else {
          error.value = handleResponse(response.value);
        }
      }
    });

    const changePage = (pag) => {
      currentPage.value = pag;
    };

    const usersItems = computed(() => {
      paggination.value = paginate(users.value.length, currentPage.value, pageSize);
      return users.value.slice(
        paggination.value.startIndex,
        paggination.value.endIndex + 1
      );
    });

    return { users, error, usersItems, currentPage, paggination, changePage };
  },
};
</script>

<style scopped>
a:hover .icon {
  color: black !important;
}

.truncate-text {
  overflow: hidden !important;
  -webkit-line-clamp: 1 !important;
}
body {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: #19191d;
  font-weight: 300;
}

p {
  color: #b3b3b3;
  font-weight: 300;
}

h1,
h2,
h3,
h4,
h5,
h6,
.h1,
.h2,
.h3,
.h4,
.h5,
.h6 {
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

a {
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
}
a,
a:hover {
  text-decoration: none !important;
}

.content {
  padding: 7rem 0;
}

h2 {
  font-size: 20px;
  color: #fff;
}

.custom-table {
  min-width: 900px;
}
.custom-table thead tr,
.custom-table thead th {
  border-top: none;
  border-bottom: none !important;
  color: #fff;
}
.custom-table tbody th,
.custom-table tbody td {
  color: #777;
  font-weight: 400;
  padding-bottom: 20px;
  padding-top: 20px;
  font-weight: 300;
}
.custom-table tbody th small,
.custom-table tbody td small {
  color: #b3b3b3;
  font-weight: 300;
}
.custom-table tbody tr:not(.spacer) {
  border-radius: 7px;
  overflow: hidden;
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
}
.custom-table tbody tr:not(.spacer):hover {
  -webkit-box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.1);
}
.custom-table tbody tr th,
.custom-table tbody tr td {
  background: #25252b;
  border: none;
  -webkit-transition: 0.3s all ease;
  -o-transition: 0.3s all ease;
  transition: 0.3s all ease;
}
.custom-table tbody tr th a,
.custom-table tbody tr td a {
  color: #b3b3b3;
}
.custom-table tbody tr th:first-child,
.custom-table tbody tr td:first-child {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
.custom-table tbody tr th:last-child,
.custom-table tbody tr td:last-child {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.custom-table tbody tr.spacer td {
  padding: 0 !important;
  height: 3px;
  border-radius: 0 !important;
  background: transparent !important;
}
.custom-table tbody tr.active th,
.custom-table tbody tr.active td,
.custom-table tbody tr:hover th,
.custom-table tbody tr:hover td {
  color: #fff;
  background: #2e2e36;
}
.custom-table tbody tr.active th a,
.custom-table tbody tr.active td a,
.custom-table tbody tr:hover th a,
.custom-table tbody tr:hover td a {
  color: #fff;
}

/* Custom Checkbox */
.control {
  display: block;
  position: relative;
  margin-bottom: 25px;
  cursor: pointer;
  font-size: 18px;
}

.control input {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.control__indicator {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 4px;
  border: 2px solid #3f3f47;
  background: transparent;
}

.control--radio .control__indicator {
  border-radius: 50%;
}

.control:hover input ~ .control__indicator,
.control input:focus ~ .control__indicator {
  border: 2px solid #007bff;
}

.control input:checked ~ .control__indicator {
  border: 2px solid #007bff;
  background: #007bff;
}

.control input:disabled ~ .control__indicator {
  background: #e6e6e6;
  opacity: 0.6;
  pointer-events: none;
  border: 2px solid #ccc;
}

.control__indicator:after {
  font-family: "icomoon";
  content: "\e5ca";
  position: absolute;
  display: none;
}

.control input:checked ~ .control__indicator:after {
  display: block;
  color: #fff;
}

.control--checkbox .control__indicator:after {
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -52%);
  -ms-transform: translate(-50%, -52%);
  transform: translate(-50%, -52%);
}

.control--checkbox input:disabled ~ .control__indicator:after {
  border-color: #7b7b7b;
}

.control--checkbox input:disabled:checked ~ .control__indicator {
  background-color: #007bff;
  opacity: 0.2;
  border: 2px solid #007bff;
}
</style>