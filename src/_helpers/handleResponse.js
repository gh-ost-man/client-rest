const handleResponse =(response) => {
    if (response) {
        if (response.status == 200) {
            return response.data;
        }

        if (response.status == 400) {
            if (response.data.error || response.data.errors) {
                return response.data.error ? JSON.stringify(response.data.error) : JSON.stringify(response.data.errors);
            }
        }
        if (response.status == 500) {
            return "505 Server Error";
        }
        if (response.status == 401) {
            console.log("401 Unauthorized");
        }
        if (response.status == 403) {
            console.log("403 Forbidden");
        }

        if (response.status == 404) {
            console.log("404 Not found");
            if (response.data.error || response.data.errors) {
                if(response.data.error) {
                    return JSON.stringify(response.data.error);
                }

                if(response.data.errors) {
                    return JSON.stringify(response.data.errors);
                }

                if(response.data.title) {
                    return JSON.stringify(response.data.title);
                }
            }
        }
    }

    return response;
}

export default handleResponse;