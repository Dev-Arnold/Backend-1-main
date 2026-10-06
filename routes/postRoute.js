import express from "express";
import { createPost, getAllPosts, getOnePost, updateOnePost, deleteOnePost } from "../controllers/postController.js";
import authorise from "../middlewares/authorise.js";
const router = express.Router();

router.post('/', authorise(["admin", "user"]), createPost);

router.get('/', getAllPosts);

router.get('/:id', getOnePost);

router.patch('/:id', updateOnePost);

router.delete('/:id', deleteOnePost);

export default router;
