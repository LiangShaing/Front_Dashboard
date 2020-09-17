import axios from "axios";
import uri from "@/api/uri"

const env = process.env.DEPLOY_ENV.toString().trim();

const HOST = {
    local: process.env.LOCAL_API,
    dev: process.env.DEV_API,
    sit: process.env.SIT_API,
    test: process.env.TEST_API
}



const axiosInstance = axios.create({
    baseURL: HOST[env],
    // timeout: 2500,
    // withCredentials: true,
});

//使用代理別人
// let isRefreshing_req = false;
// axiosInstance.interceptors.request.use(function (config) {
//     isRefreshing_req = false
//     if (config.url !== '/login') {
//         const token = JSON.parse(window.sessionStorage.getItem("token"))
//         if (token) {
//             config.headers['Authorization'] = 'Bearer ' + token;
//         } else {

//             alert("您已登出，請重新登入")
//             $nuxt._router.push("/audit/logout");

//         }
//     }


//     const currentUser = JSON.parse(window.sessionStorage.getItem("currentUser"))
//     const userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"))
//     if (currentUser && currentUser.cmUserId !== userInfo.cmUserId) {
//         config.headers['CurrentAgent'] = currentUser.cmUserId;
//     }

//     return config;
// }, function (error) {

//     return Promise.reject(error);
// });


// let isRefreshing = false;
// let failedQueue = [];
// const interceptor = (axiosInstance) => (error) => {
//     const _axios = axiosInstance;
//     const originalRequest = error.config;
//     if ((error.response.status === 401 || error.response.status === 400) && error.response.config.url === uri.login) {
//         isRefreshing = false
//         window.sessionStorage.clear();
//         // alert("您已登出，請重新登入")
//         $nuxt._router.push("/audit/logout");

//         return Promise.reject(error);
//     } else if (error.response.status === 500) {
//         isRefreshing = false
//         $nuxt.$store.dispatch("alert", '操作失敗' + error.response.data);
//         return Promise.reject(error);
//     } else if (error.response.status === 404) {
//         isRefreshing = false
//         $nuxt._router.push("/error");
//         return Promise.reject(error);
//     } else if (error.response.status === 403) {
//         isRefreshing = false
//         $nuxt.$store.dispatch("alert", '操作失敗');
//         return Promise.reject(error);
//     } else if (error.response.status === 401 && !originalRequest._retry) {

//         if (isRefreshing) {
//             return new Promise(function (resolve, reject) {
//                 failedQueue.push({ resolve, reject })
//             }).then(token => {
//                 originalRequest.headers['Authorization'] = 'Bearer ' + token;
//                 return _axios.request(originalRequest);
//             }).catch(err => {
//                 return Promise.reject(error);
//             })

//         }

//         originalRequest._retry = true;
//         isRefreshing = true;
//         return new Promise((resolve, reject) => {
//             // general
//             isRefreshing = false

//             // Oauth
//             // axiosInstance.post(uri.login, getRefreshToken(), {
//             //     auth: {
//             //         username: 'yuantalife',
//             //         password: 'mySecret'
//             //     }
//             // }).then(tokenRefreshResponse => {
//             //     storeToken(tokenRefreshResponse.data.access_token, tokenRefreshResponse.data.refresh_token)
//             //     originalRequest.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access_token;
//             //     processQueue(null, tokenRefreshResponse.data.access_token);
//             //     resolve(_axios(originalRequest));
//             // }).catch(error => {
//             //     processQueue(error, null);
//             //     reject(error);
//             //     return Promise.reject(error);
//             // }).then(() => {
//             //     isRefreshing = false
//             // })

//         })
//     }
//     return Promise.reject(error);
// };

// axiosInstance.interceptors.response.use(response => response, interceptor(axiosInstance));


// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     })
//     failedQueue = [];
// }

// const getRefreshToken = () => {
//     const refreshToken = JSON.parse(window.sessionStorage.getItem("refresh_token"))
//     const formData = new FormData()
//     formData.append('refresh_token', refreshToken)
//     formData.append('grant_type', 'refresh_token')

//     return formData
// }

// const storeToken = (token, refresh_token) => {
//     window.sessionStorage.removeItem("token");
//     window.sessionStorage.removeItem("refresh_token");
//     window.sessionStorage.setItem('token', JSON.stringify(token))
//     window.sessionStorage.setItem('refresh_token', JSON.stringify(refresh_token))
// }

// const clear = () => {
//     window.sessionStorage.removeItem("token");
//     window.sessionStorage.removeItem("refresh_token");
//     window.sessionStorage.removeItem("userInfo");
//     window.sessionStorage.removeItem("currentUser");
//     window.sessionStorage.removeItem("token");
//     window.sessionStorage.removeItem("menu");
//     window.sessionStorage.removeItem("agent");

// }

export default axiosInstance