import axios from "axios"

export const resumeBaseURL = axios.create({
    baseURL :"http://localhost:5000"
})


