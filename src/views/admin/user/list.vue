<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Users</h2>
      <div class="row" v-if="users">
        <div class="col-md-4" >
          <router-link  v-if="isVisibleHandle(['Admin'])" class="btn btn-outline-info" :to="{ name: 'CreateUser' }"
            >Create</router-link
          >
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-3 my-2">
              <div>
                <select
                  class="form-select w-auto c-select"
                  aria-label="Default select example"
                  v-model="filterRole"
                  @change="filterHandle"
                >
                  <option value="" selected class="text-white">All</option>
                  <option
                    class="text-white"
                    v-for="role in roles"
                    :key="role.value"
                    :value="role.value"
                  >
                    {{ role.title }}
                  </option>
                </select>
              </div>
            </div>
            <div class="col-md-6 my-2">
              <div>
                <input
                  class="form-control c-input"
                  placeholder="filter by email or firstname or lastname"
                  type="text"
                  v-model.trim="filterEFL"
                  @keydown.enter="filterHandle"
                />
              </div>
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-light" @click="resetFilter">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive">
        <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          :totalPages="paggination.totalPages"
          @changePage="changePage"
        ></paggination>
        <table class="table custom-table" v-if="users">
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
            <template v-for="user in users" :key="user.id">
              <tr class="c-table-hover" scope="row">
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
                   v-if="isVisibleHandle(['Admin'])"
                    class="btn btn-outline-light mx-1"
                    :to="{ name: 'EditUser', params: { id: user.id } }"
                  >
                    <i class="icon">
                      <font-awesome-icon icon="pen-to-square"
                    /></i>
                  </router-link>
                  <router-link
                    v-if="
                      user.roles.toLowerCase().includes('Student'.toLowerCase()) 
                      && isVisibleHandle(['Manager']) 
                    "
                    class="btn btn-outline-light mx-1"
                    :to="{ name: 'UserExams', params: { id: user.id } }"
                  >
                    <i class="icon">
                      <font-awesome-icon icon="clipboard-list" />
                    </i>
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
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Paggination from "@/components/Paggination";
import Roles from "@/_helpers/_role.js";
export default {
  components: { Paggination },
  setup() {
    const users = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getAllUsers } = usersService();
    const { currentUser } = authService();
    const currentPage = ref(1);
    const paggination = ref({ pages: [1], totalPages: 1 });
    const pageSize = 15;

    const filterEFL = ref(null); // by email or firstname or lastname
    const filterRole = ref("");
    const roles = ref([]);

    onMounted(async () => {
      Roles.forEach((element) => {
        roles.value.push({ title: element.toUpperCase(), value: element });
      });

      getFilterFromStorage();
      await getData();
    });

    /**
     * Get data from server
     */
    const getData = async () => {
      let filter = {};
      if (filterEFL.value) {
        filter.efl = filterEFL.value;
      }

      if (filterRole.value) {
        filter.role = filterRole.value;
      }

      filterStorage();

      var response = await getAllUsers(currentPage.value, pageSize, filter);

      if (response && response.value) {
        if (response.value.status === 200) {
          users.value = response.value.data.items;
          paggination.value = {
            pages: response.value.data.pages,
            totalPages: response.value.data.totalPages,
          };
        } else {
          users.value = null;
          handleResponse(response.value).forEach((element) => {
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
     */
    const changePage = async (pag) => {
      if (currentPage.value === pag) {
        return;
      }

      currentPage.value = pag;
      users.value = [];

      await getData();
    };

    /**
     * Safe all filters to session storage
     */
    const filterStorage = () => {
      let filterObj = {};

      filterObj.role = filterRole.value;
      filterObj.efl = filterEFL.value;
      filterObj.currentPage = currentPage.value;

      sessionStorage.filterUsers = JSON.stringify(filterObj);
    };

    /**
     * Get all filters from session storage
     */

    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem("filterUsers");

      if (filter) {
        let filterObj = JSON.parse(filter);
        filterRole.value = filterObj.role ? filterObj.role : "";
        filterEFL.value = filterObj.efl ? filterObj.efl : "";
        currentPage.value = filterObj.currentPage ? filterObj.currentPage : "";
      }
    };

    const resetFilter = async () => {
      currentPage.value = 1;
      filterRole.value = "";
      filterEFL.value = null;

      await getData();
    };
    const filterHandle = async () => {
      currentPage.value = 1;
      await getData();
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
      users,
      filterEFL,
      currentPage,
      paggination,
      filterRole,
      roles,
      changePage,
      filterHandle,
      resetFilter,
      isVisibleHandle,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>