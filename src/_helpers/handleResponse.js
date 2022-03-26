const handleResponse = (response) => {
    if (response) {
        if (response.status == 200) {
            return response.data;
        }
        if (response.status == 400) {
            if (response.data.error || response.data.errors) {
                if (response.data.error) {
                    return [response.data.error];
                }

                if (response.data.errors) {
                    var obj = response.data.errors;
                    var values = Object.keys(obj).map(function (key) {
                        if (!Number.isInteger(Number.parseInt(key))) {
                            return obj[key].join(", ");
                        }
                        else {
                            return obj[key];
                        }
                    });

                    return values;
                }
            }

            if(response.data.title) {
                return [response.data.title];
            }

            console.clear();
            console.log("BADDDDDDD: ********** : ", response.data);
        }
        // if (response.status === 405) {
        //     return ["Method Not Allowed"];
        // }
        // if (response.status == 500) {
        //     return response.data.error ? [response.data.error] : ["500 Server Error"];
        // }
        if (response.status == 401) {
            return ["401 Unauthorized"]
        }
        if (response.status == 403) {
            return ['403 Forbidden'];
        }
        if (response.status == 404) {

            if (response.data.error || response.data.errors || response.data.title) {

                if (response.data.error) {
                    return [response.data.error];
                }

                if (response.data.errors) {
                    var obj = response.data.error || response.data.errors || response.data.title;
                    var values = Object.keys(obj).map(function (key) {
                        if (obj[key].length) {
                            return obj[key].join(', ');
                        } else {
                            return obj[key];
                        }
                    });

                    console.log(values);

                    return [];
                }

                if (response.data.title) {
                    return [response.data.title];
                }

            } 
            // else {
            //     return ["Not found"];
            // }
        }
        // if (response.status == 415) {
        //     return [response.data.title];
        // }
    }

     return []
}

export default handleResponse;