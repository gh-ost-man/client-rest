<template>
  <div class="rounded mt-5 mb-5">
    <div class="row">
      <div class="col-md-12 border-right mb-3 text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">
            <i class="fa-solid fa-circle-user"></i>
              Profile
            </h4>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-2">
            <div class="col-md-12">
              <label class="labels text-secondary">First name</label>
              <p>{{ currentUser.firstName }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-secondary">Last name</label>
              <p>{{ currentUser.lastName }}</p>
            </div>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels text-secondary">Email</label>
              <p>{{ currentUser.email }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-secondary">Roles</label>
              <p>{{ currentUser.roles }}</p>
            </div>
            <hr class="bg-secondary" />
            <div class="col-md-12">
              <label class="labels text-secondary">CreatedAt</label>
              <p>{{ new Date(currentUser.createdAt).toLocaleString() }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-secondary">UpdatedAt</label>
              <p>{{ new Date(currentUser.createdAt).toLocaleString() }}</p>
            </div>
            <hr class="bg-secondary" />
            <div class="col-md-12">
              <label class="labels text-secondary">Additional info</label>
              <p>{{ currentUser.additionalInfo }}</p>
            </div>
            <hr class="bg-secondary" />
          </div>
        </div>
      </div>
      <div v-if="error">
        <textarea
          class="form-control bg-dark text-secondary border-0"
          style="overflow: hidden"
          cols="30"
          rows="15"
          :value="error"
        ></textarea>
      </div>
      <div class="col-md-6 border-right text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">
            <i class="fa-solid fa-user-gear"></i>
              Profile Settings
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
                v-model="userUpdateObj.firstName"
              />
            </div>
            <div class="col-md-6">
              <i class="fa-solid fa-user m-2 fs-5"></i>
              <label class="labels">Last nmae</label
              ><input
                type="text"
                class="form-control bg-transparent text-white"
                v-model="userUpdateObj.lastName"
                placeholder="surname"
              />
            </div>
          </div>
           <hr class="bg-secondary" />
          <div class="row mt-3">
            <div class="col-md-12">
              <i class="fa-solid fa-at m-2 fs-5"></i>
              <label class="labels">Email</label
              ><input
                type="text"
                class="form-control bg-transparent text-white"
                placeholder="enter email"
                v-model="userUpdateObj.email"
              />
            </div>
            <div class="col-md-12 mt-2">
              <i class="fa-solid fa-circle-info m-2 fs-5"></i>
              <label class="labels">Additional info</label
              ><textarea
                class="form-control bg-transparent text-white"
                placeholder="enter address line 1"
                v-model="userUpdateObj.additionalInfo"
              />
            </div>
          </div>
          <hr class="bg-secondary" />
          <div class="mt-5">
            <button
              class="btn btn-outline-light profile-button"
              @click="saveProfileHandle"
              :disabled="loading"
              type="button"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 border-right text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">
              <i class="fa-solid fa-lock"></i>
              Change password
            </h4>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-3">
            <div class="col-md-12">
               <i class="fa-solid fa-lock m-2 fs-5"></i>
              <label class="labels">Current password</label
              ><input
                type="text"
                class="form-control bg-transparent text-white"
                placeholder="enter password"
                v-model="changePasswordObj.currentPassword"
              />
            </div>
          </div>
          <hr class="bg-secondray" />
          <div class="row mt-3">
            <div class="col-md-12">
               <i class="fa-solid fa-lock m-2 fs-5"></i>
              <label class="labels">New password</label
              ><input
                type="text"
                class="form-control bg-transparent text-white"
                placeholder="enter New password"
                v-model="changePasswordObj.newPassword"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-12">
              <i class="fa-solid fa-lock m-2 fs-5"></i>
              <label class="labels">Confirm password</label
              ><input
                type="text"
                class="form-control bg-transparent text-white"
                placeholder="enter Confirm password"
                v-model="changePasswordObj.confirmPassword"
              />
            </div>
          </div>
          <hr class="bg-secondray" />
          <div class="mt-5">
            <button
              class="btn btn-outline-light profile-button"
              @click="changePasswordHandle"
              type="button"
            >
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";
import authService from "@/_services/authService.js";
import userService from "@/_services/userService.js";
export default {
  setup() {
    const { currentUser, setAuth, setAuthUser } = authService();
    const { update, changePassword, getById } = userService();
    const loading = ref(false);
    const error = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;

    const userUpdateObj = ref({
      id: currentUser.value.id,
      firstName: currentUser.value.firstName,
      lastName: currentUser.value.lastName,
      email: currentUser.value.email,
      additionalInfo: currentUser.value.additionalInfo,
    });
    const changePasswordObj = ref({
      idUser: currentUser.value.id,
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    });

    const saveProfileHandle = async () => {
      loading.value = true;
      error.value = null;

      // console.log(userUpdateObj.value);
      let response = await update(userUpdateObj.value);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Update Successfully");

          let res = await getById(currentUser.value.id);

          if (res && res.value) {
            if (res.value.status === 200) {
              // console.log(res.value.data);
              setAuthUser(res.value.data);
            }
          }
        } else {
          error.value = handleResponse(response.value);
        }
      }
    };

    const changePasswordHandle = async () => {
      error.value = null;

      if (
        changePasswordObj.value.currentPassword &&
        changePasswordObj.value.newPassword &&
        changePasswordObj.value.confirmPassword
      ) {
        if (
          changePasswordObj.value.newPassword !==
          changePasswordObj.value.confirmPassword
        ) {
          toast.error("Passwords mismatch!");
        } else {
          console.log(changePasswordObj.value);
          loading.value = true;
          let response = await changePassword(changePasswordObj.value);
          loading.value = false;

          if (response && response.value) {
            if (response.value.status === 204) {
              toast.success("Password changed successfully!");
              changePasswordObj.value = {
                idUser: currentUser.value.id,
                currentPassword: null,
                newPassword: null,
                confirmPassword: null,
              };
            } else {
              // JSON.parse(handleResponse(response.value))
              // error.value = handleResponse(response.value);
              error.value = JSON.stringify(
                JSON.parse(handleResponse(response.value)),
                undefined,
                2
              );
            }
          }
        }
      } else {
        toast.error("Fill all fields!");
      }
    };

    return {
      loading,
      error,
      currentUser,
      userUpdateObj,
      changePasswordObj,
      saveProfileHandle,
      changePasswordHandle,
    };
  },
};
</script>

<style>
</style>