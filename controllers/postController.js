import Post from "../model/post.js";
import User from "../model/user.js";

const createPost = async (req, res) => {

   try {
        let { title, snippet, body } = req.body;

        if(!title || !snippet || !body){
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findById(req.user.id);

        let post = await Post.create({ 
            title, 
            snippet, 
            body,
            authorId: req.user.id
        });

        user.postId.push(post._id);
        user.save();

        res.status(201).json({ message: "Post created successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getAllPosts = async(req, res)=>{
    try {
        let posts = await Post.find().populate("authorId", "name email");

        if(!posts) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getOnePost = async(req, res)=>{
    try {
        let { id } = req.params;

        let post = await Post.findById(id).populate("authorId", "name email");

        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateOnePost = async(req, res)=>{
    try {
        let { id } = req.params;
        let newData = req.body;

        let post = await Post.findByIdAndUpdate(id, newData, { new: true });

        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteOnePost = async(req, res)=>{
    try {
        let { id } = req.params;

        let post = await Post.findByIdAndDelete(id);

        if(!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    createPost,
    getAllPosts,
    getOnePost,
    updateOnePost,
    deleteOnePost
}

