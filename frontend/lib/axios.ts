import Axios from 'axios';
import { showLoader, hideLoader } from './loader';

const instance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
});

instance.interceptors.request.use((config) => {
  showLoader();
  return config;
}, (error) => {
  hideLoader();
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
  hideLoader();
  return response;
}, (error) => {
  hideLoader();
  return Promise.reject(error);
});

export default instance;


