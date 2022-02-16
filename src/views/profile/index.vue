<template>
  <div class="rounded mt-5 mb-5">
    <div class="row">
      <div class="col-md-12 border-right mb-3 text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right c-logo1">
              <i class="fa-solid fa-circle-user"></i>
              Profile
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row">
            <div class="col-md-12">
              <label class="labels text-info c-text">First name</label>
              <p class="text-warning mx-2">{{ currentUser.firstName }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-info c-text">Last name</label>
              <p class="text-warning mx-2">{{ currentUser.lastName }}</p>
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels text-info c-text">Email</label>
              <p class="text-warning mx-2">{{ currentUser.email }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-info c-text">Roles</label>
              <p class="text-warning mx-2">{{ currentUser.roles }}</p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <label class="labels text-info c-text">CreatedAt</label>
              <p class="text-warning mx-2">
                {{ new Date(currentUser.createdAt).toLocaleString() }}
              </p>
            </div>
            <div class="col-md-12">
              <label class="labels text-info c-text">UpdatedAt</label>
              <p class="text-warning mx-2">
                {{ new Date(currentUser.createdAt).toLocaleString() }}
              </p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <label class="labels text-info c-text">Additional info</label>
              <p class="text-warning mx-2">{{ currentUser.additionalInfo }}</p>
            </div>
            <hr class="bg-info" />
          </div>
        </div>
      </div>
      <div v-if="error">
        <textarea
          class="form-control bg-dark text-info border-0"
          style="overflow: hidden"
          cols="30"
          rows="15"
          readonly
          :value="error"
        ></textarea>
      </div>
      <div class="col-md-6 border-right text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right text-info">
              <i class="fa-solid fa-user-gear"></i>
              Profile Settings
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-2">
            <div class="col-md-6">
              <label class="labels c-label">
                <i class="fa-solid fa-user m-2 fs-5"></i>
                First name</label
              ><input
                type="text"
                class="form-control bg-transparent text-white c-input"
                placeholder="first name"
                v-model="userUpdateObj.firstName"
              />
            </div>
            <div class="col-md-6">
              <label class="labels c-label">
                <i class="fa-solid fa-user m-2 fs-5"></i>
                Last nmae</label
              ><input
                type="text"
                class="form-control bg-transparent text-white c-input"
                v-model="userUpdateObj.lastName"
                placeholder="surname"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="fa-solid fa-at m-2 fs-5"></i>
                Email</label
              ><input
                type="text"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter email"
                v-model="userUpdateObj.email"
              />
            </div>
            <div class="col-md-12 mt-2">
              <label class="labels c-label">
                <i class="fa-solid fa-circle-info m-2 fs-5"></i>
                Additional info</label
              ><textarea
                class="form-control bg-transparent text-white c-input"
                placeholder="enter address line 1"
                v-model="userUpdateObj.additionalInfo"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="mt-5">
            <button
              class="btn btn-outline-info profile-button"
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
            <h4 class="text-right text-info">
              <i class="fa-solid fa-lock"></i>
              Change password
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="fa-solid fa-lock m-2 fs-5"></i>
                Current password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter password"
                v-model="changePasswordObj.currentPassword"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="fa-solid fa-lock m-2 fs-5"></i>
                New password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter New password"
                v-model="changePasswordObj.newPassword"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="fa-solid fa-lock m-2 fs-5"></i>
                Confirm password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter Confirm password"
                v-model="changePasswordObj.confirmPassword"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="mt-5">
            <button
              class="btn btn-outline-info profile-button"
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
import { ref, getCurrentInstance, onMounted } from "vue";
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

    onMounted(async () => {
      await getUserData();
    });

    const getUserData = async () => {
      let res = await getById(currentUser.value.id);

      if (res && res.value) {
        if (res.value.status === 200) {
          setAuthUser(res.value.data);
        }
      }
    };

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
          await getUserData();
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

<style scopped>
.c-text {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
}

.c-logo1 {
  font-size: 30px;
  letter-spacing: 5px;
  text-transform: uppercase;
  -webkit-box-reflect: below -15px linear-gradient(transparent, #0004);
  color: #fff;
  text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
    0 0 80px #03bcf4, 0 0 160px #03bcf4, 0 0 400px #03bcf4;
}

/* .c-logo span {
  animation:  animate 5s linear infinite;
}

@keyframes animate {
    0%, 18%, 50.1%, 60%, 65.1%, 80%, 90.1%, 92%{
        color: #0e3742;
        text-shadow: none;
    }
    18.1%, 20.1%,30%,50%, 60.1%, 65%,80.1%, 90%, 92.1%, 100% {
        color:#fff;
        text-shadow:  0 0 10px #03bcf4,
        0 0 20px #03bcf4,
        0 0 40px #03bcf4,
        0 0 80px #03bcf4,
        0 0 160px #03bcf4,
        0 0 400px #03bcf4;
    }
} */

.c-label {
  color: cyan;
}

.c-input {
  color: #ffc107 !important;
  border: 0 !important;
  border-bottom: 1px solid #ffc107 !important;
}
.c-input:focus {
  border: 1px solid cyan !important;
  border-color: cyan !important;
}
</style>