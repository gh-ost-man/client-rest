import useApi from "../composables/useApi"

const userService = () => {
    const apiUrl = 'https://localhost:9001/api/users';
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

    const sendMessage = async(data) => {
        return await post(apiUrl + "/SendMessage", data);
    }

    const updateEmail = async(data) => {
        return await post(apiUrl + "/UpdateEmail", data);
    }
    return { getAllUsers , getById, update, changePassword,createUser, addRole, removeRole, removeUser,sendMessage,updateEmail }
}


export default userService


