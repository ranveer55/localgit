const localhost = {
    ws: 'https://staging.taplingua.com:3500',
    api: 'http://localhost:8000/api',
    base: 'https://api2.taplingua.com',
    social: {
        google: {
            profile: '/auth/google/profile'
        },
        facebook: {
            profile: '/auth/facebook/profile'
        }
    }
}

const server = {
    ws: 'https://staging.taplingua.com:3500',
    api: 'https://api2.taplingua.com/api',
    base: 'https://api2.taplingua.com',
    social: {
        google: {
            profile: '/auth/google/profile'
        },
        facebook: {
            profile: '/auth/facebook/profile'
        }
    }
}

const endpoints = window.location.hostname === 'localhost' ? localhost : server;

export default endpoints