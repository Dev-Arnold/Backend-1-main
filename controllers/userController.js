import { config } from "dotenv";
config();
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const createUser = async(req,res) =>{
    try {
        let { name, email, password } = req.body;
        let imageurl = req?.file?.path || null;

        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.create({ 
            name, 
            email, 
            image: imageurl,
            password: hashedPassword 
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our App!',
            html: `
                <p>Hello ${name},</p><p>Thank you for signing up for our app! We're excited to have you on board.</p><p>Best regards,<br>The Team</p>
            `,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const login = async(req,res) =>{
    try {
        let { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        let checkUser = await User.findOne({ email });

        if(!checkUser){
            return res.status(404).json({ message: "Incorrect email" });
        }

        let checkPassword = await bcrypt.compare(password, checkUser.password);
        if(!checkPassword){
            return res.status(401).json({ message: "Incorrect password" });
        }

        let token = jwt.sign(
            { id: checkUser._id, role: checkUser.role },
             process.env.SECRET_KEY,
              { expiresIn: "1h" }
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60, // 1 hour
        });

        return res.status(200).json({ message: "Login successful", user:{
            id: checkUser._id,
            name: checkUser.name,
            email: checkUser.email,
            role: checkUser.role,
            image: checkUser.image
        } });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllUsers = async(req,res) =>{
    try {
        let users = await User.find();

        if(!users){
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getOneUser = async(req,res) =>{
    try {
        let { id } = req.params;

        let user = await User.findById(id);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteOneUser = async(req,res) =>{
    try {
        let { id } = req.params;

        let user = await User.findByIdAndDelete(id);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateOneUser = async(req,res) =>{
    try {
        let { id } = req.params;
        // yes
        let newData= req.body;

        let user = await User.findByIdAndUpdate(id, newData, { new: true });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const forgotpassword = async(req,res) =>{
    try {
        let { email } = req.body;

        if(!email){
            return res.status(400).json({ message: "Email is required" });
        }

        let user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a password reset token
        let token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Send email with password reset link
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            html: `
                <p>Hello ${user.name},</p>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <p><a href="${process.env.CLIENT_URL}/reset-password/${token}">Reset Password</a></p>
            `,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ message: "Password reset email sent" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}   

const resetpassword = async(req,res) =>{
    try {
        let { token, newPassword } = req.body;

        if(!token || !newPassword){
            return res.status(400).json({ message: "Token and new password are required" });
        }

        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        let userId = decoded.id;

        let hashedPassword = await bcrypt.hash(newPassword, 10);

        let user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const checkUser =async(req,res)=>{
    try {
        let user = await User.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(403).json({message:"You are not logged in. Please login"})
        }

        res.status(200).json({user})
        
    } catch (error) {
         console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const logout =async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"Logout successful"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { 
    createUser, 
    getAllUsers, 
    getOneUser,
    deleteOneUser,
    updateOneUser,
    login,
    forgotpassword,
    resetpassword,
    checkUser,
    logout
};