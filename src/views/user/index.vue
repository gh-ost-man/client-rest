<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Users</h2>
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
          v-if="paggination.pages.length > 1"
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

    onMounted(async () => {
      var response = await getAllUsers();

      if (response && response.value) {
        if (response.value.status === 200) {
          users.value = response.value.data;

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

    const usersItems = computed(() => {
      paggination.value = paginate(
        users.value.length,
        currentPage.value,
        pageSize
      );
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
@import "../../assets/table.css";
</style>