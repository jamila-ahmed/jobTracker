import prisma from "../lib/prisma.js";

export const createJob = async (req, res) => {
    try {
        const jobData = req.body;
        const newjob = await prisma.job.create({
            data: {
                company: jobData.company,
                role:  jobData.role,
                status: jobData.status,
                notes: jobData.notes,
                appliedDate: new Date(jobData.appliedDate),
                userId: req.userId
            }
        })

        res.status(201).json(newjob)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await prisma.job.findMany(
            {
                where: { userId: req.userId}
            }
        )
         res.status(200).json(jobs)

    } catch (error) {
       res.status(500).json({ error: "failed to retrieve jobs" })
    }
}

export const getjobById = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const job = await prisma.job.findUnique({
            where: { id }
        })
        if (!job) {
            res.status(404).json({ error: "Job not found" })
            return
        }
        res.status(200).json(job)
    } catch (error) {
        res.status(500).json({ error: "failed to retrieve job" })
    }
}

export const updateJob = async (req, res) => {
    try {
        
         const id = parseInt(req.params.id)
         const jobData = req.body

         const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                title: jobData.title,
                company: jobData.company, 
                status: jobData.status,
                notes: jobData.notes,
                role: jobData.role
            }
        })
        res.status(200).json(updatedJob)

    } catch (error) {
        res.status(500).json({
            error: "Failed to update job"
        })
    }
}

export const deleteJob = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
         await prisma.job.delete({
            where: { id }
        })
        res.status(200).json({ 
            message: "Job deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            error: "Failed to delete job"
        })
    }
}