require('dotenv').config()
const axios = require('axios')
// const express = require('express');
const {EBULKSMS_USERNAME, EBULKSMS_APIKEY} = process.env

async function _sms(data){
    try {
        const config =  {
            method:"post",
            url:"https://api.ebulksms.com:8080/sendsms.json",
            data:{
                "SMS": {
                    "auth": {
                        "username": `${EBULKSMS_USERNAME}`,
                        "apikey": `${EBULKSMS_APIKEY}`
                    },
                    "message": {
                        "sender": "Green NOTE",
                        "messagetext": `Welcome ${data.token} is your Greenote verification code.`,
                        "flash": "0"
                    },
                "recipients":{
                "gsm": 
                {
                    "msidn": `${data.phone_number}`,
                    "msgid": "Otp"
                },
            
                },
                "dndsender": 1
            }
        }
    }   
    const bulkRes = await axios(config)
    let _smsRes = bulkRes.data
    if(_smsRes.response.status == "SUCCESS"){
        let  message = "Your One time password(OTP) has been sent to you";
        return message
    }else{
        let  message = "Bad Request";
        return message;
    }
    
} catch (error) {
    let message = error
    return message;
    // console.log(error)
}

}

module.exports = {_sms}