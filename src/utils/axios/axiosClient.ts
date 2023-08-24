import axios from "axios";
import { baseURL } from "../../constant/baseURL";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const axiosFileClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export default axiosClient;
