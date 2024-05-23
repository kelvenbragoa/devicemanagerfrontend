import axios from 'axios';
import router from './../router/index';
import { useRouter } from 'vue-router';

// export const baseURL = 'https://backend.cct.co.mz/api';
// export const storageURL = 'https://backend.cct.co.mz/storage/images/';
// export const baseURL = 'http://10.0.8.3:8000/api';
// export const storageURL = 'http://10.0.8.3:8000/storage/images/';
export const baseURL = 'http://127.0.0.1:8000/api';
export const storageURL = 'http://127.0.0.1:8000/storage/images/';

export function logout() {
    axios.post(`${baseURL}/logout`).then((response) => {
        console.log(response);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/login');
    });
}
