const localhost = {
    ws: 'http://localhost:3005',
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

const server = {
    ws: 'https://staging.taplingua.com:3500',
    api: (window.location.hostname === "dashboard2.taplingua.com" ? "https://api2.taplingua.com/api" : "https://apistaging.taplingua.com/api"),
    base: (window.location.hostname === "dashboard2.taplingua.com" ? "https://api2.taplingua.com" : "https://apistaging.taplingua.com"),
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