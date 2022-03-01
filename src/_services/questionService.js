import useApi from "../composables/useApi"

const questionService = () => {
    const apiUrl = 'https://localhost:9001/api/questions';
    const { post, get, put, remove } = useApi();
  
    const getAllQuestions = async (page, limit, filter ) => {
        let query = "?";
        if(page) {
            query  += "page=" + page;
        }

        if(filter) {
            if(filter.category) {
                query+= "&category="+filter.category;
            }

            if(filter.context) {
                query+= "&context="+filter.context;
            }

        }

        if(limit) {
            query+= "&limit="+limit;
        }

        return await get(apiUrl + query);
    }

    const getQuestionById = async(id) => {
        return await get(apiUrl +"/" + id);
    }

    const createQuesiton = async(data) => {
        console.log(data);

        return await post(apiUrl , data);
    }

    const updateQuestion = async(id, data) => {
        return await put(apiUrl + "/"+ id, data);
    }
    
    return {getAllQuestions, getQuestionById,createQuesiton, updateQuestion}
}


export default questionService