import useApi from "../composables/useApi"

const userService = () => {
    const apiUrl = 'https://localhost:7001/api/Users';
    const { post, get, put, remove } = useApi();

    const getAllUsers = async () => {
        return await get(apiUrl);
    }

    const getById = async (id) => {
        return await get(apiUrl + "/" + id);
    }

    const update = async (user) => {
        return await put(apiUrl + "/" + user.id, user);
    }

    const changePassword = async(data) => {
        return await post(apiUrl + "/ChangePassword", data)
    }

    const createUser = async(user) => {
        return await post(apiUrl, user);
    }

    const addRole = async(data) => {
        console.log(data);
        return await post(apiUrl + "/AddRole", data);
    }
    const removeRole = async(data ) => {
        return await post(apiUrl + "/RemoveRole", data);
    }

    const removeUser = async(id) => {
        return await remove(apiUrl + "/" + id);
    }
    return { getAllUsers , getById, update, changePassword,createUser, addRole, removeRole, removeUser }
}


export default userService