import axios from 'axios';
import { link_api } from '../config/api-config';
 
async function signUpApi(fullName, password,confirmPassword, email) {
    return await axios.post(link_api.REGISTER_LINK, {
        fullName: fullName,
        password: password,
        confirmPassword,
        email: email,
    })
    .then(response => {
       
        return response.data;
    })
    .catch(error => {
        // Handle error
        console.log(error.response.data);
        return error.response.data;
        
    });
}

export default signUpApi;
