import axios from 'axios';
import router from './../router/index';
import { useRouter } from 'vue-router';


export const baseURL = 'http://127.0.0.1:8000/api';

export function logout() {

    axios.post(`${baseURL}/logout`).then((response) => {
        console.log(response);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/auth/login');
    });
}
