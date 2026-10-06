import express from "express"
import  authorise  from "../middlewares/authorise.js"
import { createUser, getAllUsers, getOneUser, login, updateOneUser, deleteOneUser, forgotpassword, resetpassword, checkUser, logout} from "../controllers/userController.js"
const router = express.Router()
import upload from "../middlewares/upload.js"

router.post('/', upload.single('image'), createUser)

router.get('/', authorise(["admin"]), getAllUsers)

router.get('/checkUser', authorise(["admin","user"]), checkUser)

router.post('/forgotpass', forgotpassword)

router.post('/resetpass', resetpassword)

router.get('/:id', getOneUser)

router.post('/login', login)

router.post('/logout', logout)

router.patch('/:id', authorise(["admin"]), updateOneUser)

router.delete('/:id', authorise(["admin"]), deleteOneUser)

export default router