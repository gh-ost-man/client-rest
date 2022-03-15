<template>
  <div class="text-white">
    <router-link :to="{ name: 'UsersList' }" class="btn btn-outline-info mb-3"
      ><i><font-awesome-icon icon="circle-arrow-left" /></i
    ></router-link>

    <form @submit.prevent="submitHandle">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="text-right c-title">
          <i class=""><font-awesome-icon icon="user-circle" /></i>
          Create
        </h4>
      </div>
      <hr class="bg-secondary" />
      <div class="row mt-2">
        <div class="col-md-6">
          <label class="labels c-label">
            <i class="m-2 fs-5 c-">
              <font-awesome-icon icon="user" />
            </i>
            First name</label
          ><input
            type="text"
            class="form-control c-input"
            placeholder="first name"
            v-model="userObj.firstName"
          />
        </div>
        <div class="col-md-6">
          <label class="labels c-label">
            <i class="m-2 fs-5">
              <font-awesome-icon icon="user" />
            </i>
            Last name</label
          ><input
            type="text"
            class="form-control c-input"
            placeholder="surname"
            v-model="userObj.lastName"
          />
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
          <label class="labels c-label">
            <i class="m-2 fs-5">
              <font-awesome-icon icon="at" />
            </i>
            Email</label
          ><input
            type="email"
            class="form-control c-input"
            placeholder="enter email"
            v-model="userObj.email"
          />
        </div>
        <div class="col-md-12 mt-2">
          <label class="labels c-label">
            <i class="m-2 fs-5">
              <font-awesome-icon icon="circle-info" />
            </i>
            Additional info</label
          ><textarea
            class="form-control c-input"
            placeholder="enter additional info"
            v-model="userObj.additionalInfo"
          />
        </div>
        <div class="col-md-12 mt-2">
          <label class="labels c-label">
            <i class="m-2 fs-5">
              <font-awesome-icon icon="key" />
            </i>
            Role</label
          >
          <select
            class="form-select c-select"
            v-model="role"
            aria-label="Default select example"
          >
            <option
              class="text-white"
              v-for="r in roles"
              :key="r.value"
              :value="r.value"
            >
              {{ r.title }}
            </option>
          </select>
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="mt-5">
        <button
          class="btn btn-outline-info profile-button"
          v-if="!loading"
          type="submit"
        >
          Create
        </button>
        <button
          class="btn btn-outline-light profile-button"
          :disabled="loading"
          v-if="loading"
          type="submit"
        >
          Creating...
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import usersService from "@/_services/userService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";

export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);

    const { createUser, addRole } = usersService();
    
    const roles = ref(
      Role.map((e) => {
        return { title: e, value: e };
      })
    );
    const role = ref(null);
    const userObj = ref({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      additionalInfo: null,
    });

    const submitHandle = async () => {
      loading.value = true;
      var response = await createUser(userObj.value);

      if (response && response.value) {
        if (response.value.status === 201) {
          userObj.value = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            additionalInfo: null,
          };
          toast.success("User created successfully");

          // Add roles to new user
          var res = await addRole({
            userId: response.value.data.id,
            role: role.value,
          });
          loading.value = false;
          if (res && res.value) {
            if (res.value.status === 204) {
              toast.success("Roles added successfullly");
              role.value = null;
            } else {
              loading.value = false;
              handleResponse(res.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
            }
          }
        } else {
          loading.value = false;
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    return { userObj, loading, role, roles, submitHandle };
  },
};
</script>

<style >
</style>