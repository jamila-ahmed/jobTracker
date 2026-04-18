import express from "express"
import { tokenMiddleware } from "../middleware/token.js"
import {  createJob,
     getAllJobs,
    getjobById,
    updateJob,
    deleteJob } from "../services/JobServices.js"


const router = express.Router()


router.post("/", tokenMiddleware,createJob)
router.get("/", tokenMiddleware, getAllJobs)
router.get("/:id", tokenMiddleware, getjobById)
router.put("/:id", tokenMiddleware, updateJob)
router.delete("/:id", tokenMiddleware, deleteJob)

export default router