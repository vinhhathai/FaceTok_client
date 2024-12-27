import axios from 'axios';
import { link_api } from '../config/api-config';
 
async function signUpApi(username, password,confirmPassword, email, birthday) {
    return await axios.post(link_api.REGISTER_LINK, {
        username: username,
        password: password,
        confirmPassword,
        email: email,
        birthday: birthday
    })
    .then(response => {
        // Handle successful response
        console.log(response.data);
       
        return response.data;
    })
    .catch(error => {
        // Handle error
        console.log(error.response.data);
        return error.response.data;
        
    });
}

export default signUpApi;
