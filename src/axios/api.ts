import axios from "axios"
import { Cookies } from "react-cookie";

export const api = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:8080/v1/"
});

export const geoCoder = axios.create({
    withCredentials: true,
    baseURL: "https://geocoding-api.open-meteo.com/v1/"
})

api.interceptors.request.use(
    config => {
        const cookies = new Cookies();
        const token = cookies.get('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        config.withCredentials = true

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);