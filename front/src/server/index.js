import _ from 'lodash'
import axios from 'axios'
export default async (url='',data={},type='GET')=>{
    
    if(type=='GET'){
        let datastr='';
        _.mapKeys(data,(val,key)=>{
            datastr+=key+'='+val+'&'
        })
        if(datastr!==''){
            datastr=datastr.substr(0,datastr.lastIndexOf('&'));
            url=url+'?'+datastr;
        }
    }
    try{
       let response = await axios({
           method:type,
           url:url,
           data:data
       })
       return response.data.data;
       
    }catch(e){
        
        throw new Error(e)
    }
} 