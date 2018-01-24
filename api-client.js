const API_URL = 'EXAMPLE_URL';

function getDogsFromApi() {
    return axios.get(`${API_URL}/dogs`)
}

function addDogToApi(dog) {
    return axios.post(`${API_URL}/dogs`, dog)
}

function deleteDogFromApi(id) {
    return axios.delete(`${API_URL}/dogs/${id}`)

}