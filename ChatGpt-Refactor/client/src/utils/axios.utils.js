import axios from "axios"

const BASE_URL = "/api"

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})