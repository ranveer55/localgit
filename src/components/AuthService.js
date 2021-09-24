import decode from 'jwt-decode';
import endpoints from '../config/endpoints';
import axios from 'axios';
export default class AuthService {
    // Initializing important variables
    constructor(domain) {
        // this.domain = domain || 'https://api1.taplingua.com/v1' // API server domain
        // this.domain = domain || 'http://localhost:8000/api' // API server domain
        this.domain = domain || endpoints.api // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }
    forgotpass(email) {
        // Get a token from api server using the fetch api
        return this.fetch(`${this.domain}/user/password/reset`, {
            method: 'POST',
            body: JSON.stringify({
                email
            })
        }).then(res => {
            return Promise.resolve(res);
            /* if(res.token){
                this.setToken(res.token) // Setting the token in localStorage
                this.setProfile(res.firstName, res.email)
                return Promise.resolve(res);
            }
            if(res.message){
                return Promise.reject(res.message);
            } */
        })
    }
    login(email, password) {
        // Get a token from api server using the fetch api
        // return this.fetch(`${this.domain}/api-login.php`, {
        return this.fetch(`${this.domain}/user/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => {
            if(res.token){
                if(res.accesslevel!= "0"){
                    this.setToken(res.token) // Setting the token in localStorage
                    this.setProfile(res)
                    return Promise.resolve(res);
                }else{
                    const result = {firstName: '', email: '', company_code:'', company_name: '',  access_level:'', accepted_gdpr:''}
                    this.setProfile(result)
                    return {message: "Disabled Access."};
                }
            }
            if(res.message){
                return Promise.reject(res.message);
            }
        })
    }
    loginGoogle(token) {
        // Get a token from api server using the fetch api
        return axios.get(endpoints.api + endpoints.social.google.profile, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            const res = response.data;
            if (res.token) {
                if (res.accesslevel !== "0") {
                    this.setToken(res.token) // Setting the token in localStorage
                    this.setProfile(res);
                    if (res.accesslevel !== "0") {
                        window.location.href = '/overview';
                    } else {
                        alert('Access Level Disabled, Contact Admin');
                    }
                } else {
                    const result = { firstName: '', email: '', company_code: '', company_name: '', access_level: '', accepted_gdpr: '' }
                    this.setProfile(result)
                    alert('Access Level Disabled, Contact Admin');
                }
            }
        })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert('something went wrong, please try again!');
                }
            });
    }

    loginFacebook(token) {
        // Get a token from api server using the fetch api
        return axios.get(endpoints.api + endpoints.social.facebook.profile, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            const res = response.data;
            if (res.token) {
                if (res.accesslevel !== "0") {
                    this.setToken(res.token) // Setting the token in localStorage
                    this.setProfile(res);
                    if (res.accesslevel !== "0") {
                        window.location.href = '/overview';
                    } else {
                        alert('Access Level Disabled, Contact Admin');
                    }
                } else {
                    const result = { firstName: '', email: '', company_code: '', company_name: '', access_level: '', accepted_gdpr: '' }
                    this.setProfile(result)
                    alert('Access Level Disabled, Contact Admin');
                }
            }
        })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert('something went wrong, please try again!');
                }
            });
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        console.log('idToken',idToken)
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }
    setProfile(data) {//res.firstName, res.email
        // Saves user token to localStorage
        localStorage.setItem('firstName', data.firstName)
        localStorage.setItem('email', data.email)
        localStorage.setItem('company_code', data.CompanyCode)
        localStorage.setItem('company_name', data.companyName)
        localStorage.setItem('access_level', data.accesslevel)
        localStorage.setItem('accepted_gdpr', data.acceptedGDPR)
    }
    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    setCompanyName(companyName) {
        // Saves user token to localStorage
        localStorage.setItem('company_name', companyName)
    }
    

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        //return decode(this.getToken());
        return localStorage.getItem('email')
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}