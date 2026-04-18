import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"


const router = express.Router()


// Registration route

router.post("/register",async (req, res) => {
    try {
        const { username, password, email} = req.body
         
        
        if(!username || !password || !email) {
           return res.status(400).json({
                status: "failed",
                message: "all fields are required"
            })
        }

        const userExit =  await prisma.user.findUnique({
            where: { email}
        })
        

        if(userExit) {
           return res.status(400).json({
                status: "failed",
                message:  "This user already exist"
            })
        }


        const hashedPassword = await bcrypt.hash(password, 10)
         
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }, 
            select: {
                id: true,
                username: true,
                email: true
            }
           
        })
        

         res.status(201).json({
                status: "success",
                message: "user register successfully",
                data: newUser
            })
        

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "failed to register user",
            error: error.message
        })
    }
})


// Login router

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
           return res.status(400).json({
                status: "failed",
                message: "all fields are required"
            })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
           return res.status(404).json({
                status: "failed",
                message: "user not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                message: "invalid email or password"
            })
        }

        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET || "secretkey", 
            { expiresIn: "24h"})
            
        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            token 
        }
        )

    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "failed to login user",
            error: error.message
        })
    }
})

router.post("/logout", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "User logged out successfully"
    })
})


export default router