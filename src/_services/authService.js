import useApi from "../composables/useApi"
import { useRouter } from "vue-router";

import { ref } from "vue"

const authService = () => {
    const apiUrl = 'https://localhost:7001/api/Auth';
    const router = useRouter();
    const { post } = useApi();
    const currentUser =ref(localStorage.user? JSON.parse(localStorage.user): null); 

    const login = async (data) => {
      

        var response = await post(apiUrl + "/Login", data);

        if (response.value) {
            if (response.value.status == 200) {
                setAuth(response.value.data);
            }
        }

        return response;
    }

    const setAuth = (data) => {
        console.log(data);

        localStorage.user = JSON.stringify(data.user)
        localStorage.accessToken = data.token;
        localStorage.refreshToken = data.refreshToken;

        currentUser.value = JSON.parse(localStorage.user);
    }

    const setAuthUser = (user) => {
        localStorage.user = JSON.stringify(user);
        currentUser.value = user;
    }

    const register = async (data) => {
        var response = await post(apiUrl + "/Register", data);

        if (response.value) {
            if (response.value.status == 200) {
                setAuth(response.value.data)

                // localStorage.user = JSON.stringify(response.value.data.user)
                // localStorage.accessToken = response.value.data.token;
                // localStorage.refreshToken = response.value.data.refreshToken;

                // currentUser.value = JSON.parse(localStorage.user);
            }
        }

        return response;
    }


    // const refreshToken = async () => {

    //     if (localStorage.accessToken && localStorage.refreshToken) {
    //         let data = {
    //             token: localStorage.accessToken,
    //             refreshToken: localStorage.refreshToken
    //         }

    //         var response = await post(apiUrl + "/RefreshToken", data);

    //         if (response && response.value) {
    //             if (response.value.status === 200) {
    //                 localStorage.user = JSON.stringify(response.value.data.user)
    //                 localStorage.accessToken = response.value.data.token;
    //                 localStorage.refreshToken = response.value.data.refreshToken;
    //             }
    //         }

    //         return response;

           
    //     } else {
    //         console.log("Access Token not exists");
    //         router.push({ name: 'Login' });
    //         return null;
    //     }

    // }

    const logOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        currentUser.value = null;
    }
    return { currentUser, setAuth, setAuthUser, login, register, logOut }
}


export default authService