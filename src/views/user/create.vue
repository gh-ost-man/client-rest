<template>
  <div class="p-3 text-white">
  
    <form @submit.prevent="submitHandle">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="text-right" >
          <i class="bx bx-user-circle"></i>
          Create user
        </h4>
      </div>
      <hr class="bg-secondary" />
      <div class="row mt-2">
        <div class="col-md-6">
          <i class="fa-solid fa-user m-2 fs-5"></i>
          <label class="labels">First name</label
          ><input
            type="text"
            class="form-control bg-transparent text-white"
            placeholder="first name"
            v-model="userObj.firstName"
          />
        </div>
        <div class="col-md-6">
          <i class="fa-solid fa-user m-2 fs-5"></i>
          <label class="labels">Last nmae</label
          ><input
            type="text"
            class="form-control bg-transparent text-white"
            placeholder="surname"
            v-model="userObj.lastName"
          />
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-12">
          <i class="fa-solid fa-lock m-2 fs-5"></i>
          <label class="labels">Password</label
          ><input
            type="password"
            class="form-control bg-transparent text-white"
            placeholder="enter password"
            v-model="userObj.password"
          />
        </div>
        <div class="col-md-12">
          <i class="fa-solid fa-at m-2 fs-5"></i>
          <label class="labels">Email</label
          ><input
            type="email"
            class="form-control bg-transparent text-white"
            placeholder="enter email"
            v-model="userObj.email"
          />
        </div>
        <div class="col-md-12 mt-2">
          <i class="fa-solid fa-circle-info m-2 fs-5"></i>
          <label class="labels">Additional info</label
          ><textarea
            class="form-control bg-transparent text-white"
            placeholder="enter additional info"
            v-model="userObj.additionalInfo"
          />
        </div>
        <div class="col-md-12 mt-2">
          <i class="fa-solid fa-key m-2 fs-5"></i>
          <label class="labels">Role</label>
          <select
            class="form-select bg-transparent text-white"
            v-model="role"
            aria-label="Default select example"
          >
            <option
              class="text-dark"
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
          class="btn btn-outline-light profile-button"
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
    const { createUser, addRole } = usersService();
    const error = ref(null);
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
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

          console.log("ID: ", response.value.data.id);

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

    return { userObj, error, loading, role, roles, submitHandle };
  },
};
</script>

<style >
</style>