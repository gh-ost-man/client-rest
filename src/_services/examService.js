import useApi from "../composables/useApi"

const examService = () => {
    const apiUrl = 'https://localhost:9001/api/exams';
    const { post, get, put, remove } = useApi();

    const getAllExams = async () => {
        return await get(apiUrl);
    }

    const getExamById = async (id) => {
        return await get(apiUrl + "/" + id);
    }

    const getAllExamQuestions = async (id) => {
        return await get(apiUrl + "/" + id + "/questions");
    }

    const createExam = async (data) => {
        return await post(apiUrl, data);
    }

    const updateExam = async (id, data) => {
        return await put(apiUrl + "/" + id, data);
    }

    const addQuestionToExam = async(id, data) =>  {
        return await post(apiUrl + "/" + id + "/questions", data)
    }

    const removeQuestionFromExam = async (idExam, idQuestion) => {
        return await remove(apiUrl + "/" + idExam + "/questions/" + idQuestion);
    }

    return { getAllExams, getExamById, getAllExamQuestions, createExam, updateExam , addQuestionToExam, removeQuestionFromExam }
}


export default examService