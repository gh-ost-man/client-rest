import { useStore } from "vuex";
import useApi from "../composables/useApi"

const userService = () => {
    const store = useStore();
    const apiUrl = store.state.apigw.host+'/api/users';
    const { post, get, put, remove } = useApi();

    const getAllUsers = async (page, limit, filter, middleVal, qtyBetween) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }

        if(filter) {
            if(filter.efl) {
                query+= "&filter="+filter.efl;
            }

            if(filter.role) {
                query+= "&role="+filter.role;
            }
        }

        if(limit) {
            query+= "&limit="+limit;
        }

        if(middleVal) {
            query+= "&middleVal="+middleVal;
        }

        if(qtyBetween) {
            query+= "&cntBetween="+qtyBetween;
        }

        return await get(apiUrl + query);
    }

    const getUserById = async (id) => {
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

    const getUserExams = async(id, page, limit) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }
        if(limit) {
            query+= "&limit="+limit;
        }
        return await get(apiUrl + "/exams/" +id + query);
    }

    const addExamToUser = async(data) =>{
        return await post(apiUrl+"/addExam", data);
    }
    
    const removeExamFromUser = async(data) =>{
        return await post(apiUrl+"/removeExam", data);
    }

    return { getAllUsers, getUserExams,addExamToUser, removeExamFromUser, getUserById, update, changePassword,createUser, addRole, removeRole, removeUser,sendMessage,updateEmail }
}


export default userService