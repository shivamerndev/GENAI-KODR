import axios from "../utils/axios.utils"
import handleError from "../utils/error.handler"

export const googleAuthService = (credentials) => {
    return axios.post("/auth/google", { idToken: credentials.credential })
}

export const profileService = handleError(() => {
    return axios.get("/auth/profile")
})