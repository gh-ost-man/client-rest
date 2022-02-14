<template>
  <div class="rounded mt-5 mb-5">
    <div class="row" >
      <div class="col-md-12 border-right mb-3 text-white" v-if="user">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">
           <i class="fa-solid fa-circle-user"></i>
              User
            </h4>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-2">
            <div class="col-md-12">
              <label class="labels text-secondary">First name</label>
              <p>{{ user.firstName }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-secondary">Last name</label>
              <p>{{ user.lastName }}</p>
            </div>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels text-secondary">Email</label>
              <p>{{ user.email }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-secondary">Roles</label>
              <p>{{ user.roles }}</p>
            </div>
            <hr class="bg-secondary" />
            <div class="col-md-12">
              <label class="labels text-secondary">CreatedAt</label>
              <p>{{ new Date(user.createdAt).toLocaleString() }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-secondary">UpdatedAt</label>
              <p>{{ new Date(user.updatedAt).toLocaleString() }}</p>
            </div>
            <hr class="bg-secondary" />
            <div class="col-md-12">
              <label class="labels text-secondary">Additional info</label>
              <p>{{ user.additionalInfo }}</p>
            </div>
            <hr class="bg-secondary" />
            <div class="col-md-12">
              <button
                class="btn btn-outline-danger"
                @click="removeUserHandle"
                :disabled="loading"
              >
                Delete User
              </button>
            </div>
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
      <div class="col-md-6 border-right text-white" v-if="user">
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
                v-model.trim="userUpdateObj.firstName"
              />
            </div>
            <div class="col-md-6">
              <i class="fa-solid fa-user m-2 fs-5"></i>
              <label class="labels">Last name</label
              ><input
                type="text"
                class="form-control bg-transparent text-white"
                v-model.trim="userUpdateObj.lastName"
                placeholder="enter last name"
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
                v-model.trim="userUpdateObj.email"
              />
            </div>
            <div class="col-md-12 mt-2">
              <i class="fa-solid fa-circle-info m-2 fs-5"></i>
              <label class="labels">Additional info</label
              ><textarea
                class="form-control bg-transparent text-white"
                placeholder="enter additional info"
                v-model.trim="userUpdateObj.additionalInfo"
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
      <div class="col-md-6 border-right text-white" v-if="user">
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
                type="password"
                class="form-control bg-transparent text-white"
                placeholder="enter password"
                v-model.trim="changePasswordObj.currentPassword"
              />
            </div>
          </div>
          <hr class="bg-secondray" />
          <div class="row mt-3">
            <div class="col-md-12">
              <i class="fa-solid fa-lock m-2 fs-5"></i>
              <label class="labels">New password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white"
                placeholder="enter New password"
                v-model.trim="changePasswordObj.newPassword"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-12">
              <i class="fa-solid fa-lock m-2 fs-5"></i>
              <label class="labels">Confirm password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white"
                placeholder="enter Confirm password"
                v-model.trim="changePasswordObj.confirmPassword"
              />
            </div>
          </div>
          <hr class="bg-secondray" />
          <div class="mt-5">
            <button
              class="btn btn-outline-light profile-button"
              @click="changePasswordHandle"
              :disabled="loading"
              type="button"
            >
              Change password
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 border-right text-white" v-if="user">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">
              <i class="fa-solid fa-key"></i>
              Add Role
            </h4>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-2">
            <div class="col-md-12">
              <i class="fa-solid fa-key m-2 fs-5"></i>
              <label class="labels">Role</label>
              <select
                class="form-control bg-transparent text-white"
                v-model.trim="newRole"
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
          <div class="mt-5">
            <button
              class="btn btn-outline-light profile-button"
              @click="addRoleHandle"
              :disabled="loading"
              type="button"
            >
              Add role
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 border-right text-white" v-if="user">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right">
              <i class="fa-solid fa-key"></i>
              Remove Role
            </h4>
          </div>
          <hr class="bg-secondary" />
          <div class="row mt-2">
            <div class="col-md-12">
              <i class="fa-solid fa-key m-2 fs-5"></i>
              <label class="labels">Role</label>
              <select
                class="form-control text-white bg-transparent text-white"
                v-model.trim="roleRemove"
              >
                <option
                  class="text-dark"
                  v-for="r in userRoles"
                  :key="r.value"
                  :value="r.value"
                >
                  {{ r.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="mt-5">
            <button
              class="btn btn-outline-light profile-button"
              @click="removeRoleHandle"
              type="button"
            >
              Remove role
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="loading">
      <div
        class="spinner-border align-center text-primary text-center"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  
<div class="modal fade show" id="exampleModal" tabindex="1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";
import userService from "@/_services/userService.js";
export default {
  setup() {
    const { update, changePassword, getById, addRole, removeRole, removeUser } =
      userService();
    const loading = ref(false);
    const error = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;
    const route = useRoute();
    const router = useRouter();
    const user = ref(null);
    const userUpdateObj = ref(null);
    const changePasswordObj = ref(null);
    const roles = ref([]); // list of roles that the user does not have
    const userRoles = ref([]); // list of user roles
    const newRole = ref(null); // role for add
    const roleRemove = ref(null); // role f remove

    const fetchData = async () => {
      error.value = null;
      userRoles.value = [];
      roles.value = [];
      newRole.value = null;
      roleRemove.value = null;
      loading.value = true;
      let response = await getById(route.params.id);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 200) {
          user.value = response.value.data;

         

          Role.forEach((element) => {
            if (!user.value.roles.includes(element)) {
              roles.value.push({ title: element, value: element });
            }
          });


          let arr = user.value.roles.split(", ");
          arr.forEach((element) => {
            userRoles.value.push({ title: element, value: element });
          });


          userUpdateObj.value = {
            id: user.value.id,
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            email: user.value.email,
            additionalInfo: user.value.additionalInfo,
          };

          changePasswordObj.value = {
            idUser: user.value.id,
            currentPassword: null,
            newPassword: null,
            confirmPassword: null,
          };
        } else {
          error.value = JSON.stringify(
            handleResponse(response.value),
            undefined,
            2
          );
        }
      }
    };

    onMounted(async () => {
      await fetchData();
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
          await fetchData();
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
                idUser: user.value.id,
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

    const addRoleHandle = async () => {
      error.value = null;
      loading.value = true;

      let response = await addRole({
        userId: user.value.id,
        role: newRole.value,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Role added successfully");
          await fetchData();
        } else {
          toast.error("Some errors");
          error.value = JSON.stringify(
            JSON.parse(handleResponse(response.value)),
            undefined,
            2
          );
        }
      }
    };

    const removeRoleHandle = async () => {
      error.value = null;
      loading.value = true;

      let response = await removeRole({
        userId: user.value.id,
        role: roleRemove.value,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Role removed successfully");
          await fetchData();
        } else {
          toast.error("Some errors");
          error.value = JSON.stringify(
            JSON.parse(handleResponse(response.value)),
            undefined,
            2
          );
        }
      }
    };

    const removeUserHandle = async () => {
      error.value = null;
      loading.value = true;
      let response = await removeUser(user.value.id);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success(`User ${user.value.email} removed successfully`);
          router.push({ name: "Users" });
        } else {
          error.value = JSON.stringify(
            JSON.parse(handleResponse(response.value)),
            undefined,
            2
          );
        }
      }
    };

    return {
      loading,
      error,
      user,
      newRole,
      roleRemove,
      userRoles,
      roles,
      userUpdateObj,
      changePasswordObj,
      saveProfileHandle,
      changePasswordHandle,
      addRoleHandle,
      removeRoleHandle,
      removeUserHandle,
    };
  },
};
</script>

<style>
</style>