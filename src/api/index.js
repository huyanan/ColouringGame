import axios from 'axios';
let instance = axios.create({
    baseURL: 'http://127.0.0.1:7000',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    
}); 
instance.interceptors.response.use(    
    response => {   
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        if (response.status === 200) {            
            return Promise.resolve(response.data);        
        } else {            
            return Promise.reject(response);        
        }    
    },
)
export default instance