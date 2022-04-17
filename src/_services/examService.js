import { useStore } from "vuex";
import useApi from "../composables/useApi"

const examService = () => {
    const store=useStore();
    // const apiUrl = 'http://localhost:9000/api/exams'; //Local Ocelot
     const apiUrl = store.state.apigw.host+'/api/exams'; 
    //const apiUrl = 'http://localhost:6012/api/exams'; //Local
    const { post, get, put, remove } = useApi();

    const getAllExams = async (page,  limit, filter, middleVal, qtyBetween) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }
        if (middleVal) {
            query += "&middleVal=" + middleVal;
        }

        if (qtyBetween) {
            query += "&cntBetween=" + qtyBetween;
        }

        if(filter) {
            if(filter.title) {
                query+= "&title="+filter.title;
            }
            if(filter.status) {
                query+= "&status="+filter.status;
            }
        }

        if(limit) {
            query+= "&limit="+limit;
        }
        
        console.log(query);
        return await get(apiUrl + query);
    }

    const getExamById = async (id) => {
        return await get(apiUrl + "/" + id);
    }

    const getAllExamQuestions = async (id, page, limit) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }
      
        if(limit) {
            query+= "&limit="+limit;
        }

        return await get(apiUrl + "/" + id + "/questions" + query);
    }

    const createExam = async (data) => {
        return await post(apiUrl, data);
    }

    const updateExam = async (id, data) => {
        return await put(apiUrl + "/" + id, data);
    }

    const removeExam = async(id) => {
        return await remove(apiUrl + "/" + id);
    }

    const addQuestionToExam = async(id, data) =>  {
        return await post(apiUrl + "/" + id + "/questions", data)
    }

    const removeQuestionFromExam = async (idExam, idQuestion) => {
        return await remove(apiUrl + "/" + idExam + "/questions/" + idQuestion);
    }

    return { getAllExams, getExamById, getAllExamQuestions, createExam, updateExam , addQuestionToExam, removeQuestionFromExam,removeExam,  }
}


export default examService