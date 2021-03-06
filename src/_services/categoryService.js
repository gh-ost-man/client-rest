import { useStore } from "vuex";
import useApi from "../composables/useApi"

const categoryService = () => {
    const store = useStore();
    // const apiUrl = 'http://localhost:9000/api/categories';
    const apiUrl = store.state.apigw.host+'/api/categories';
    //const apiUrl = 'http://acme.com/api/categories';
    const { post, get, put, remove } = useApi();
    
    const getAllCategories = async (page, limit, middleVal, qtyBetween) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }

        if(limit) {
            query+= "&limit="+limit;
        }

        if (middleVal) {
            query += "&middleVal=" + middleVal;
        }

        if (qtyBetween) {
            query += "&cntBetween=" + qtyBetween;
        }
        
        return await get(apiUrl + query);
    }
   
    const getCategoryById = async (id) => {
        return await get(apiUrl + "/" + id);
    }


    const createCategory = async(data) => {
        return await post(apiUrl, data);
    }

    const updateCategory = async(id,data) => {
        return await put(apiUrl + "/" + id, data);
    }

    const deleteCategory = async(id) => {
        return await remove(apiUrl + "/"+ id);
    }

    return {getAllCategories ,getCategoryById,  createCategory, updateCategory, deleteCategory}
}


export default categoryService