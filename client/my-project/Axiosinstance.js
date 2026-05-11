import axios from "axios"

export const resumeBaseURL = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "")
})


