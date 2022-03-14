import useApi from "../composables/useApi"


const answerService = () => {
    const apiUrl = 'https://localhost:9001/api/answers';
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