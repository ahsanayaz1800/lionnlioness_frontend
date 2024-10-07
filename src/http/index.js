import axios from "axios";
import 'dotenv/config'
const api = axios.create({
  baseURL:`${process.env.REACT_APP_BASE_URL}`,
  
})


export const googleAuthLogin = (data) => axios.post('http://localhost:8080/users/google_signin',data);
