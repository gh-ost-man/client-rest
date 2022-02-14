import useApi from "../composables/useApi"

const questionService = () => {
    const apiUrl = 'http://localhost:5002/api/Categories';
    const { post, get, put, remove } = useApi();
  
    const getQuestions = async (idCategory) => {
        return await get(apiUrl + "/" + idCategory + "/Questions");
    }

    const getQuestionById = async(idCategory, id) => {
        return await get(apiUrl + "/" + idCategory +"/Questions/" + id);
    }

    const createQuesiton = async(idCategory,data) => {
        return await post(apiUrl + "/" + idCategory + "/Questions", data);
    }

    const updateQuestion = async(idCategory, idQuestion, data) => {
        return await put(apiUrl + "/" + idCategory + "/Questions/" + idQuestion, data);
    }
    
    return {getQuestions, getQuestionById,createQuesiton, updateQuestion}
}


export default questionService