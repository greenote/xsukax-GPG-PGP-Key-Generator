const conn = require("../../config/db");
const jwt = require('jsonwebtoken')
const {_sms} = require('./bulksms')
const register = async (req, res) => {
    const {name, phone} = req.body;
    try {
        conn.query(
            "SELECT * FROM registration_tb WHERE phone = ?",
            [phone],
            async (err, result) => {
                if (err) {
                    res.status(500).json({
                        state: false,
                        error: err,
                    });
                }
                if (result.length > 0) {
                    ////if account exist then  update .. mthod
                    let status = "unverified"
                    const token = Math.floor(Math.random() * 90000) + 10000;
                    let upadateAcct = await update({token: token, phone_number: result[0].phone, status, id: result[0].id})

                    let smsResp = await _sms({phone_number: result[0].phone, token: token})

                    return res.status(200).json({
                        data: result,
                        message: "Welcome back",
                    });

                }
                //save newaccount to the database
                let newAccount = await newAcct(name, phone);
                if (newAccount.values.length > 0) {
                    return res.status(200).json({
                        data: "Registered Successfully"
                    })
                }

            });
    } catch (error) {
        res.status(500).json({
            status: false,
            error,
        });
    }
};

//new account methods
const newAcct = async (name, phone) => {

    try {
        const otp = Math.floor(Math.random() * 90000) + 10000;

        let currentDateObj = new Date();
        let currentminute = currentDateObj.getTime();
        let expiretime = currentminute + 3 * 60000

        let sql = `INSERT INTO registration_tb(name,phone, token, status, expire_time) VALUES (?,?,?,?,?)`;
        return await conn.query(sql, [name, phone, otp, "unverified", expiretime], async (err, result) => {
            if (err) return {error: err}
            if (result) {
                let smsResp = await _sms({phone_number: result[0].phone, token: otp})
                console.log(smsResp)
            }
        });
    } catch (err) {
        return {
            status: false,
            err,
        };
    }
};

// confirmation of otp###
const confirmOtp = async (req, res) => {
    let {token, id} = req.body
    let response = updateVerified({status: "verified", id});
    console.log(response);
    //getting the current minute##
    let currentDateObj = new Date();
    let currentminute = currentDateObj.getTime();
    try {
        let sql = `SELECT * FROM registration_tb where token= ?`;
        await conn.query(sql, [token], async (err, row) => {
            console.log(err, row.length);
            if (err) {

                res.status(500).send({
                    status: false,
                    err: err
                })
            } else {
                if (row.length == 0) {
                    //console.log('yes')
                    res.status(401).json({
                        message: 'No data found : otp is not valid',
                        Success: false
                    })

                }
                if (row.length > 0) {
                    let data = row[0]
                    //console.log(currentminute > Number (data.expire_time))
                    if (currentminute > Number(data.expire_time)) {
                        res.status(401).json({
                            message: 'The (OTP) code has expired'
                        })
                    } else {
                        //let changeStatus = await update({status:"verified", id})

                        res.status(200).json({
                            message: 'Account Created Successfully',
                            data
                        })
                    }

                }

            }

        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            error
        })
    }
}
const updateVerified = (data) => {
    let sql = `UPDATE registration_tb SET status ="${data.status}" WHERE id = "${data.id}"`
    return conn.query(sql, (err, result) => {
        if (err) return err
        else console.log(result)
        confirmOtp();
    })

}

//update user information method if the user exist and then used to verified user
const update = async (data) => {
    console.log(data)
    let currentDateObj = new Date();
    let currentminute = currentDateObj.getTime();
    let expiretime = currentminute + 3 * 60000
    try {
        let sql = `UPDATE registration_tb SET phone=IF(phone="undefined", "NULL", "${data.phone_number}"), token = "${data.token}", status = IF(status="${data.status}","unverified","unverified"), expire_time = "${expiretime}" WHERE id =${data.id}`
            ;
        return await conn.query(sql, (err, result) => {
            if (err) throw new Error(err, 'There is an error');
            else console.log(result)
        })

    } catch (error) {
        return {
            status: false,
            error
        }
    }
}

//resend otp
const resendOtp = async (req, res) => {
    try {
        let {id, phone_number} = req.body
        const token = Math.floor(Math.random() * 90000) + 10000;
        let response = await update({id, phone_number, token});
        // console.log(response)
        let smsResp = await _sms({phone_number, token})
        console.log(smsResp);
        if (response) {
            res.status(200).json({
                sucess: true,
            })
        }
    }
    catch (error) {
        res.status(500).send({
            status: false,
            error
        })
    }
}

module.exports = {register, confirmOtp, resendOtp}