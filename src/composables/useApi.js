import { ref, getCurrentInstance, } from "vue";
import axios from 'axios';
import { useRouter } from "vue-router";

const useApi = () => {
    const toast = getCurrentInstance().appContext.app.$toast;
    const response = ref(null);
    const router = useRouter();

    const catchError = (error) => {

        if (error.response) {
            console.log('error.response: ', error.response);
            response.value = error.response;
            if (response.value.status == 401) {
                console.log("401 Unauthorized");
            }
            if (response.value.status == 403) {
                toast.error("403 Forbidden");
                console.log("403 Forbidden");

                router.push({ name: "Forbidden" })
            }

        } else if (error.request) {
            console.log('error.request: ', error.request);
            response.value = error.request;
        } else if (error.message) {
            console.log('error.message: ', error.message);
            response.value = error.message;
        } else {
            console.log("Unknown Error: ", error);
            response.value = error;
        }
    }

    const refreshToken = async () => {

        if (localStorage.accessToken && localStorage.refreshToken) {
            let data = {
                token: localStorage.accessToken,
                refreshToken: localStorage.refreshToken
            }

            toast.info("Wait for refreshing token...")

            let res = await post("https://localhost:7001/api/Auth/RefreshToken", data);
            console.log(res.value);

            if (res.value.status === 200) {
                console.log("RERFESH TOKEN SUCCESS");
                toast.info("The token is refreshed")
                localStorage.user = JSON.stringify(response.value.data.user)
                localStorage.accessToken = response.value.data.token;
                localStorage.refreshToken = response.value.data.refreshToken;
            } else if (res.value.status === 226) {
                toast.info(res.value.data);
            }
            else {
                console.log("RERFESH TOKEN FAILDE");
                toast.error("Refresh token is Failed");
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }

            return res;

        } else {
            console.log("Access Token not exists");
            router.push({ name: 'Login' });
            return null;
        }

    }
    const get = async (url) => {
        axios.defaults.headers = {
            'Authorization': localStorage.accessToken ? `Bearer ${localStorage.accessToken}` : '',
            "content-Type": "application/json; charset=utf-8",
        }

        await axios.get(url)
            .then(res => {
                response.value = res;
            })
            .catch(error => {
                catchError(error);
            });

        if (response && response.value) {
            if (response.value.status === 401) {

                let res = await refreshToken();
                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {
                        return await get(url);
                    } else {
                        router.push({ name: 'Login' });
                        return null;
                    }
                }

            }
        }

        return response;
    }

    const post = async (url, data) => {
        axios.defaults.headers.common = {
            'Authorization': localStorage.accessToken ? `Bearer ${localStorage.accessToken}` : '',
        }
        await axios.post(url, data)
            .then(res => {
                response.value = res;
            })
            .catch(error => {
                catchError(error);
            });

        if (response && response.value) {
            if (response.value.status === 401) {

                let res = await refreshToken();
                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {

                        return await post(url, data)
                    } else {

                        router.push({ name: 'Login' });
                        return null;
                    }
                }

            }
        }

        return response;
    }
    const put = async (url, data) => {
        axios.defaults.headers.common = {
            'Authorization': localStorage.accessToken ? `Bearer ${localStorage.accessToken}` : '',
        }
        await axios.put(url, data)
            .then(res => {
                response.value = res;
            })
            .catch(error => {
                catchError(error);
            });

        if (response && response.value) {
            if (response.value.status === 401) {

                let res = await refreshToken();

                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {

                        return await put(url, data)
                    } else {

                        router.push({ name: 'Login' });
                        return null;
                    }
                }

            }
        }

        return response;
    }

    const remove = async (url) => {
        axios.defaults.headers.common = {
            'Authorization': localStorage.accessToken ? `Bearer ${localStorage.accessToken}` : '',
        }

        await axios.delete(url)
            .then(res => {
                response.value = res;
            })
            .catch(error => {
                catchError(error);
            });

        if (response && response.value) {
            if (response.value.status === 401) {
                let res = await refreshToken();

                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {

                        return await remove(url)
                    } else {
                        console.log("RERFESH TOKEN FAILDE");


                        router.push({ name: 'Login' });
                        return null;
                    }
                }
            }
        }
        return response;

    }
    return { response, get, post, put, remove, refreshToken };
}
export default useApi