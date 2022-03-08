import useApi from "../composables/useApi"

const reportService = () => {
    const apiUrl = 'https://localhost:9001/api/report';
    const { post, get, put, remove } = useApi();

    const getAllReports = async() => {
        return await get(apiUrl + "/items");
    }
    const getReportById = async(id) => {
        return await get(apiUrl + "/" + id);
    }
    const getReportsByExamId = async (idExam) => {
        return await get(apiUrl + "/items/e/" + idExam);
    }

    const getReportByExamIdAndUserId = async (idExam, idUser) => {
        return await get(apiUrl + "/items/e/" + idExam + "/a/" + idUser);
    }

    const getReportsByUserId = async(idUser) => {
        return await get(apiUrl + "/items/a/" + idUser);
    }
    const createReport = async(data) => {
        return await post(apiUrl + "/items", data);
    }

    //In the exam id
    const reportAction = async(data) => {
        return await put(apiUrl + "/action",data)
    }

    return {getAllReports, getReportById,getReportsByUserId,getReportsByExamId, reportAction,getReportByExamIdAndUserId,createReport,}
}


export default reportService