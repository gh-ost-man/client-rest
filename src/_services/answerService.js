import useApi from "../composables/useApi"

const answerService = () => {
    const apiUrl = 'https://localhost:9001/api/c';
    const { post, get, put, remove } = useApi();

    const getAnswerAll = async (idCategory, idQuestion) => {
        return await get(apiUrl + "/" + idCategory + "/q/" + idQuestion + "/Answers");
    }

    const createAnswer = async (idCategory, idQuestion, data) => {
        return await post(apiUrl + "/" + idCategory + "/q/" + idQuestion + "/Answers", data);
    }

    const updateAnswer = async (idCategory, idQuestion, idAnswer, data) => {
        return await put(apiUrl + "/" + idCategory + "/q/" + idQuestion + "/Answers/" + idAnswer, data);
    }

    const removeAnswer = async (idCategory, idQuestion, idAnswer) => {
        return await remove(apiUrl + "/" + idCategory + "/q/" + idQuestion + "/Answers/ " + idAnswer);
    }

    // const getQuestions = async (idCategory) => {
    //     return await get(apiUrl + "/" + idCategory + "/Questions");
    // }

    // const createQuesiton = async(idCategory,data) => {
    //     return await post(apiUrl + "/" + idCategory + "/Questions", data);
    // }

    return { getAnswerAll, createAnswer, updateAnswer, removeAnswer }
}


export default answerService