<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Users</h2>
      <div class="row">
        <div class="col-md-6 my-2">
          <div>
            <select
              class="form-select w-auto c-select"
              aria-label="Default select example"
              v-model="filterRole"
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
            />
          </div>
        </div>
      </div>
      <hr class="bg-secondary" />
      <!-- <div>
        <router-link class="btn btn-outline-light" :to="{ name: 'CreateUser' }"
          >Create</router-link
        >
      </div> -->
      <div class="table-responsive custom-table-responsive" v-if="users">
        <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          @changePage="changePage"
        ></paggination>
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
  components: { Paggination },
  setup() {
    const error = ref(null);
    const users = ref(null);
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getAllUsers } = usersService();
    const currentPage = ref(1);
    const pageSize = 15;
    const paggination = ref(null);
    const filterEFL = ref(null); // by email or firstname or lastname
    const filterRole = ref("");
    const roles = ref([]);

    onMounted(async () => {
      getFilterFromStorage();
      var response = await getAllUsers();

      if (response && response.value) {
        if (response.value.status === 200) {
          users.value = response.value.data;

          let arr = [];

          users.value.forEach(element => {
            arr.push(element.roles);
          });

          // get unique roles from users
          arr.forEach(element => {
            let tmp = element.split(',');

            tmp.forEach(el => {
              if(roles.value.filter(x=>x.value.toLowerCase() === el.toLowerCase()).length===0) {
                roles.value.push({title: el.toUpperCase(), value: el});
              }
            });

          });

          currentPage.value = 1;
          paggination.value = paginate(
            users.value.length,
            currentPage.value,
            pageSize
          );
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

    const changePage = (pag) => {
      currentPage.value = pag;
    };

    const filteredUsersByEFL = computed(() => {
      return filterEFL.value
        ? users.value.filter(
            (x) =>
              x.email.toLowerCase().includes(filterEFL.value.toLowerCase()) ||
              x.firstName
                .toLowerCase()
                .includes(filterEFL.value.toLowerCase()) ||
              x.lastName.toLowerCase().includes(filterEFL.value.toLowerCase())
          )
        : users.value;
    });

   const filteredUserByRoles = computed(() => {
     return filterRole.value? filteredUsersByEFL.value.filter(x=>x.roles.includes(filterRole.value)): filteredUsersByEFL.value;
   }) 

    const usersItems = computed(() => {
      filterStorage();

      paggination.value = paginate(
        users.value.length,
        currentPage.value,
        pageSize
      );
      return filteredUserByRoles.value.slice(
        paggination.value.startIndex,
        paggination.value.endIndex + 1
      );
    });


    const filterStorage = () => {
      let filterObj = {};

      filterObj.role = filterRole.value;
      filterObj.efl = filterEFL.value;

      sessionStorage.filterUsers = JSON.stringify(filterObj);
    }

    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem('filterUsers');

      if(filter) {
         let filterObj = JSON.parse(filter);
         filterRole.value = filterObj.role?filterObj.role : "";
         filterEFL.value = filterObj.efl?filterObj.efl : "";

      }
    }

    // getFilterFromStorage() {
    //   let filter = sessionStorage.getItem('filterContents');
    //   if (filter) {
    //     let filterObj = JSON.parse(filter);

    //     this.searchByTitle = filterObj.title ? filterObj.title : null;
    //     this.searchStage = filterObj.stage ? filterObj.stage : null;
    //     this.searchStatus =
    //       filterObj.status !== null && filterObj.status !== undefined
    //         ? filterObj.status
    //         : null;
    //   }
    // },
    // filterStorage() {
    //   let filterObj = {};
    //   if (typeof this.searchStatus == 'boolean') {
    //     filterObj.status = this.searchStatus;
    //   }
    //   if (this.searchStage) {
    //     filterObj.stage = this.searchStage;
    //   }
    //   if (this.searchByTitle) {
    //     filterObj.title = this.searchByTitle;
    //   }

    //   sessionStorage.filterContents = JSON.stringify(filterObj);
    // },


    return {
      users,
      error,
      filterEFL,
      usersItems,
      currentPage,
      paggination,
      filterRole,
      roles,
      changePage,
    };
  },
};
</script>

<style scoped>
@import "../../assets/css/table.css";
</style>