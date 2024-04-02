import axios from 'axios';

function signUpApi(username, password,confirmPassword, email, birthday) {
    return axios.post('http://localhost:9999/sign-up', {
        username: username,
        password: password,
        confirmPassword,
        email: email,
        birthday: birthday
    })
    .then(response => {
        // Handle successful response
        console.log(response.data.message);
       
        return response.data;
    })
    .catch(error => {
        // Handle error
        console.log(error);
        
    });
}

export default signUpApi;
