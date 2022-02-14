import { ref, getCurrentInstance, } from "vue";
import axios from 'axios';
import { useRouter } from "vue-router";

const useApi = () => {
    const toast = getCurrentInstance().appContext.app.$toast;
    const response = ref(null);
    const codes = [0, 400, 401, 403, 404, 500];
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

                router.push({name: "Forbidden"})
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

    const responseText = () => {
        if (codes.includes(response.value.status)) {
            if (response.value.status == 0) {
                toast.error("Error request");

                return null;
            }
            if (response.value.status == 400) {
                toast.error("400 Bad Request");

                if (response.value.data.error || response.value.data.errors) {
                    return response.value.data.error ? response.value.data.error : response.value.data.errors;
                }
                return null;
            }
            if (response.value.status == 500) {
                toast.error("Server Error");

                return null;
            }
            if (response.value.status == 401) {
                toast.error("401 Unauthorized");

                return null;
            }
            if (response.value.status == 403) {
                toast.error("403 Forbidden");

                return null;
            }

            if (response.value.status == 404) {
                toast.error("404 Not found");

                if (response.value.data.error || response.value.data.errors) {
                    return response.value.data.error ? response.value.data.error : response.value.data.errors;
                }
                return null;
            }
        } else {
            return response.value;
        }
    };
    const refreshToken = async () => {

        if (localStorage.accessToken && localStorage.refreshToken) {
            let data = {
                token: localStorage.accessToken,
                refreshToken: localStorage.refreshToken
            }

            let res = await post("https://localhost:7001/api/Auth/RefreshToken", data);

            if (res && res.value) {
                if (res.value.status === 200) {
                    localStorage.user = JSON.stringify(res.value.data.user)
                    localStorage.accessToken = res.value.data.token;
                    localStorage.refreshToken = res.value.data.refreshToken;
                }
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

        console.log("GET");

        await axios.get(url)
            .then(res => {
                response.value = res;
            })
            .catch(error => {
                catchError(error);
            });

        if (response && response.value) {
            if (response.value.status === 401) {
                toast.info("Wait for refreshing token...")
                let res = await refreshToken();
                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {
                        console.log("RERFESH TOKEN SUCCESS");
                        toast.info("The token is refreshed")
                        localStorage.user = JSON.stringify(response.value.data.user)
                        localStorage.accessToken = response.value.data.token;
                        localStorage.refreshToken = response.value.data.refreshToken;
                        return await get(url);
                    } else {
                        console.log("RERFESH TOKEN FAILDE");

                        localStorage.removeItem("user");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
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
                toast.info("Wait for refreshing token...")

                let res = await refreshToken();
                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {
                        console.log("RERFESH TOKEN SUCCESS");
                        toast.info("The token is refreshed")
                        localStorage.user = JSON.stringify(response.value.data.user)
                        localStorage.accessToken = response.value.data.token;
                        localStorage.refreshToken = response.value.data.refreshToken;
                        return await post(url, data)
                    } else {
                        console.log("RERFESH TOKEN FAILDE");

                        localStorage.removeItem("user");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
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
                toast.info("Wait for refreshing token...")

                let res = await refreshToken();

                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {
                        console.log("RERFESH TOKEN SUCCESS");
                        toast.info("The token is refreshed")
                        localStorage.user = JSON.stringify(response.value.data.user)
                        localStorage.accessToken = response.value.data.token;
                        localStorage.refreshToken = response.value.data.refreshToken;
                        return await put(url, data)
                    } else {
                        console.log("RERFESH TOKEN FAILDE");

                        localStorage.removeItem("user");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
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
                toast.info("Wait for refreshing token...")
                let res = await refreshToken();
                
                toast.info("Wait for refresh token...")
                console.log("RERFESH TOKEN");

                if (res && res.value) {
                    if (res.value.status === 200) {
                        console.log("RERFESH TOKEN SUCCESS");
                        toast.info("The token is refreshed")
                        localStorage.user = JSON.stringify(response.value.data.user)
                        localStorage.accessToken = response.value.data.token;
                        localStorage.refreshToken = response.value.data.refreshToken;
                        return await remove(url)
                    } else {
                        console.log("RERFESH TOKEN FAILDE");

                        localStorage.removeItem("user");
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        router.push({ name: 'Login' });
                        return null;
                    }
                }

            }
        }

        return response;

    }

    return { response, get, post, put, remove, responseText };
}


export default useApi