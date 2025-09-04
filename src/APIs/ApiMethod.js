import axios from "axios";
// import { getImportantId } from "../Utils/CommonFunction";
// import Cookies from "js-cookie";


const getHeaderInfo = async function () {
    return {
        headers: {
            "content-type": "application/json",
        },
    };
};

const handleResponse = (response) => {
    // console.log('ksdjhfksdfksjdfsjd',response);
    return response;
};

export const get = async function ( url , params = {}){
    let header = await getHeaderInfo();
    try{
        let resp = await axios.get(url, {...header, params});
        // SuccessToast(resp.data.Message);
        return handleResponse(resp);
    } catch (err){
        // ErrorToast(err?.response?.data?.error?.message);
        throw handleResponse(err?.response?.data?.error?.message);
    }
}

export const post = async function(url, params){
    try{
        let response = await axios.post(url , params);
        // SuccessToast(response.data.Message);
        return handleResponse(response)
    } catch (err) {
        // ErrorToast(err?.response?.data?.error?.message);
        throw handleResponse(err);
    }
}

export const patch = async function(url, params) {
    try{
        let response = await axios.patch(url, params);
        // SuccessToast(response?.data?.Message);
        return handleResponse(response);
    } catch (err){
        // ErrorToast(err?.response?.data?.error?.message);
        throw handleResponse(err?.response?.data?.error?.message);
    }
};

export const deleteAoi = async function (url, params = {}){
    let header = await getHeaderInfo();
    try{
        let response = await axios.delete(url, {header, params});
        // SuccessToast(response?.data?.Message);
        return handleResponse(response);
    } catch (err) {
        // ErrorToast(err?.response?.data?.error?.message);
        throw handleResponse(err?.response?.data?.error?.message);
    }
};

export const put = async function (url, params) {
    let header = await getHeaderInfo();
    try {
        let response = await axios.put(url,params );
        // SuccessToast(response?.data?.Message);
        return handleResponse(response);
    } catch (err) {
        // ErrorToast(err?.response?.data?.error?.message);
        throw handleResponse(err?.response?.data?.error?.message);
    }
};

axios.interceptors.request.use(
    (config) => {
        const access = getImportantId('token')
        config.headers['Authorization'] = 'Bearer '+access;
    
    return config; 
  },
  (error) => {
    Promise.reject(error)
  }
)