import useApi from "../composables/useApi"

const questionService = () => {
    const apiUrl = 'http://localhost:5002/api/Categories';
    const { post, get, put, remove } = useApi();
  
    const getQuestions = async (idCategory) => {
        return await get(apiUrl + "/" + idCategory + "/Questions");
    }
    
    // const getAllCategories = async () => {
    //     return await get(apiUrl);
    // }
    // const getCategory = async (id) => {
    //     return await get(apiUrl + "/" + id);
    // }


    // const createCategory = async(data) => {
    //     return await post(apiUrl, data);
    // }

    // const updateCategory = async(id,data) => {
    //     return await put(apiUrl + "/" + id, data);
    // }

    // const deleteCategory = async(id) => {
    //     return await remove(apiUrl + "/"+ id);
    // }

    return {getQuestions}
}


export default questionService