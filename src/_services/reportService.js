import { useStore } from "vuex";
import useApi from "../composables/useApi"

const reportService = () => {
    const store = useStore();
    // const apiUrl = 'http://localhost:9000/api/report';
     const apiUrl = store.state.apigw.host+'/api/reports';
    //const apiUrl = 'http://acme.com/api/reports';
    const { post, get, put, remove } = useApi();

    const getAllReports = async (page, limit, filter, middleVal, qtyBetween) => {
        let query = "?";

        if (page) {
            query += "page=" + page;
        }
        if (limit) {
            query += "&limit=" + limit;
        }
        if(middleVal) {
            query+= "&middleVal="+middleVal;
        }

        if(qtyBetween) {
            query+= "&cntBetween="+qtyBetween;
        }

        if (filter) {
            if (filter.user) {
                query += "&user=" + filter.user
            }

            if (filter.exam) {
                query += "&exam=" + filter.exam
            }

            if (filter.date) {
                query += "&date=" + filter.date
            }
        }
       
        console.log(query);

        return await get(apiUrl  + query);
    }
    const getReportById = async (id) => {
        return await get(apiUrl + "/" + id);
    }
    const getReportsByExamId = async (idExam, page, limit, filter) => {
        let query = "?";
        if (page) {
            query += "page=" + page;
        }
        if (limit) {
            query += "&limit=" + limit;
        }
        if(filter) {
           
            if(filter.date) {
                query +="&date=" + filter.date;
            }
        }
        console.log(query);
        return await get(apiUrl + "/e/" + idExam + query);
    }

    const getReportByExamIdAndUserId = async (idExam, idUser) => {
        return await get(apiUrl + "/e/" + idExam + "/a/" + idUser);
    }

    const getReportsByUserId = async (idUser) => {
        return await get(apiUrl + "/a/" + idUser);
    }
    const currentAnswer = async (data) => {
        return await post(apiUrl + "/currentanswer", data);
    }

    //Begin Exam
    const openReport = async (data) => {
        return await post(apiUrl + "/openReport", data)
    }

    //For end exam
    const closeReport = async (data) => {
        return await put(apiUrl + "/closeReport", data)
    }

    const removeReport = async(id) => {
        return await remove(apiUrl +"/"+id)
    }

    const removeReportsByExamId = async(id) => {
        return await remove(apiUrl+ "/e/"+id);
    }

    return { getAllReports, getReportById, getReportsByUserId, getReportsByExamId, openReport, closeReport, getReportByExamIdAndUserId, currentAnswer,removeReport,removeReportsByExamId, }
}

export default reportService