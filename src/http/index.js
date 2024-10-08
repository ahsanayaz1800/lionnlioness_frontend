import axios from "axios";
import 'dotenv/config'
const api = axios.create({
  baseURL:`${process.env.REACT_APP_BASE_URL}`,
  
})


export const googleAuthLogin = (data) => axios.post('https://lionnlioness-backend-djb6bmdmx-lionnlioness-projects.vercel.app/users/google_signin',data);
