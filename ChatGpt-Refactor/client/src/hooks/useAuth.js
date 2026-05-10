import { useDispatch } from "react-redux"
import { googleAuthService, profileService } from "../services/auth.service"
import { setUser } from "../store/features/auth.slice.js"
import { useNavigate } from "react-router-dom"
import handleError from "../utils/error.handler.js"

const useAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const googleAuth = async (credentials) => {

        let res = await googleAuthService(credentials)
        if (res.status === 200) {
            getProfile()
            navigate("/")
        }
    }

    const getProfile = async () => {
        try {
            let profile = await profileService()
            dispatch(setUser(profile.data.user))
        } catch (error) {
            navigate("/login")
        }
    }

    return { googleAuth, getProfile }
}

export default useAuth