import axios from 'axios';
import ApiConstant from '@/service/ApiConstant';

export default class AuthService {
     loginUser = async (email, password) => {
        console.log(email.value);
        axios.post(`${ApiConstant.baseURL}/login`, {
            email: email.value.toLowerCase(),
            password: password.value
        });
    };

    logOut = () => {
        console.log('Logout');
    };
}
