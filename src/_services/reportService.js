import useApi from "../composables/useApi"

const reportService = () => {
    const apiUrl = 'https://localhost:9001/api/report/items';
    const { post, get, put, remove } = useApi();

    const getReportsByExamId = async (idExam) => {
        return await get(apiUrl + "/" + idExam);
    }

    const getReportByExamIdAndUserId = async (idExam, idUser) => {
        return await get(apiUrl + "/" + idExam + "/a/" + idUser);
    }

    const createReport = async(data) => {
        return await post(apiUrl, data);
    }

    return {getReportsByExamId,getReportByExamIdAndUserId,createReport,}
}


export default reportService