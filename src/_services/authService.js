import useApi from "../composables/useApi"
import { ref } from "vue"

const authService = () => {
    const apiUrl = 'https://localhost:9001/api/auth';
    const { post } = useApi();
    const currentUser = ref(localStorage.user ? JSON.parse(localStorage.user) : null);

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
            }
        }

        return response;
    }

    const accessCode = async (data) => {
        return await post(apiUrl + "/SendMessage", data);
    }

    const logOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        currentUser.value = null;
    }
    return { currentUser, setAuth, setAuthUser, login, register, accessCode, logOut }
}

export default authService