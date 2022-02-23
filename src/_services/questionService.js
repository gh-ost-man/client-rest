import useApi from "../composables/useApi"

const questionService = () => {
    const apiUrl = 'https://localhost:9001/api/c';
    const { post, get, put, remove } = useApi();
  
    const getQuestions = async (idCategory) => {
        return await get(apiUrl + "/" + idCategory + "/questions");
    }

    const getQuestionById = async(idCategory, id) => {
        return await get(apiUrl + "/" + idCategory +"/questions/" + id);
    }

    const createQuesiton = async(idCategory,data) => {
        return await post(apiUrl + "/" + idCategory + "/questions", data);
    }

    const updateQuestion = async(idCategory, idQuestion, data) => {
        return await put(apiUrl + "/" + idCategory + "/questions/" + idQuestion, data);
    }
    
    return {getQuestions, getQuestionById,createQuesiton, updateQuestion}
}


export default questionService