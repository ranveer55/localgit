const localhost = {
    ws: 'http://localhost:3005',
    api: 'http://localhost:8000/api',
    social: {
        google: {
            profile: '/auth/google/profile'
        }
    }
}

const server = {
    ws: 'https://staging.taplingua.com:3500',
    api: 'https://api2.taplingua.com/api',
    social: {
        google: {
            profile: '/auth/google/profile'
        }
    }
}

const endpoints = window.location.hostname === 'localhost' ? localhost : server;

export default endpoints