import { useStore } from "vuex";
import useApi from "../composables/useApi"

const questionService = () => {
    const store = useStore();
    // const apiUrl = 'http://localhost:9000/api/questions';
    const apiUrl = store.state.apigw.host+'/api/questions';
    const { post, get, put, remove } = useApi();

    const getAllQuestions = async (page, limit, filter, middleVal, qtyBetween) => {
        let query = "?";
        if (page) {
            query += "page=" + page;
        }

        if (middleVal) {
            query += "&middleVal=" + middleVal;
        }

        if (qtyBetween) {
            query += "&cntBetween=" + qtyBetween;
        }

        if (filter) {
            if (filter.category) {
                query += "&category=" + filter.category;
            }

            if (filter.context) {
                query += "&context=" + filter.context;
            }
        }

        if (limit) {
            query += "&limit=" + limit;
        }

        return await get(apiUrl + query);
    }

    const getQuestionById = async (id) => {
        return await get(apiUrl + "/" + id);
    }

    const createQuesiton = async (data) => {
        console.log(data);

        return await post(apiUrl, data);
    }

    const updateQuestion = async (id, data) => {
        return await put(apiUrl + "/" + id, data);
    }

    const removeQuestion = async(id) => {
        return await remove(apiUrl + "/"+ id);
    }
    return { getAllQuestions, getQuestionById, createQuesiton, updateQuestion, removeQuestion }
}


export default questionService