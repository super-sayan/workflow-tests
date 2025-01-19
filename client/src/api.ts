import axios from "axios";


const BCKND_HOST = process.env.BCKND_HOST || "backend-service";  
const BCKND_PORT = process.env.BCKND_PORT || "8000";  

const api = axios.create({
  baseURL: `http://${BCKND_HOST}:${BCKND_PORT}`,
  withCredentials: true,  
});

export default api;
