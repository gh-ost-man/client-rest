import useApi from "../composables/useApi"

const categoryService = () => {
    const apiUrl = 'https://localhost:9001/api/categories';
    const { post, get, put, remove } = useApi();
    
    const getAllCategories = async (page, limit) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }

        if(limit) {
            query+= "&limit="+limit;
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