import { Router } from 'express'
import { getProfile, googleAuth } from '../controllers/auth.controller.js'
import userAuth from '../middlewares/auth.middleware.js'

const router = Router()

router.post("/google", googleAuth)
router.get("/profile", userAuth, getProfile)

export default router