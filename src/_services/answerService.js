import useApi from "../composables/useApi"
import { useStore } from "vuex";

const answerService = () => {
    // const apiUrl = 'http://localhost:9000/api/answers';
    const store = useStore();
     const apiUrl = store.state.apigw.host + '/api/answers';
    //const apiUrl = 'http://acme.com/api/answers';

    
    const { post, get, put, remove } = useApi();

    const getAllAnswer = async () => {
        return await get(apiUrl);
    }

    const getQuestionAnswers = async (idQuestion) => {
        return await get(apiUrl + "/q/" + idQuestion);
    }

    const createAnswer = async (data) => {
        return await post(apiUrl, data);
    }

    const updateAnswer = async (id, data) => {
        return await put(apiUrl + "/" + id, data);
    }

    const removeAnswer = async (idAnswer) => {
        return await remove(apiUrl + "/" + idAnswer);
    }

    return { getAllAnswer, getQuestionAnswers, createAnswer, updateAnswer, removeAnswer }
}


export default answerService