import axios from "axios";
import 'dotenv/config'
const baseURL = process.env.REACT_APP_BASE_URL;



export const googleAuthLogin = (data) => axios.post(`${baseURL}/users/google_signin`,data);
 
