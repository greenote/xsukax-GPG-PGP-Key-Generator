const db = require("../../models");
const Joi = require("joi");
const {_sms} = require('../../utilities/bulksms');
const {validationFails} = require('../../utilities/requestVal');
const {userSchema} = require('../../utilities/schemas');

const register = async (req, res) => {
	const {value: {name, phone}, error} = userSchema.validate(req.body);
	if (error) return validationFails(res, error);

	try {
		// check if user exist before
		const userExist = await db.User.findOne({where: {phone}});

		if (userExist) {
			// if user exist, create otp and send sms
			const currentminute = new Date().getTime();
			const updatedObj = {
				token: Math.floor(Math.random() * 90000) + 10000,
				status: "unverified",
				expire_time: currentminute + 3 * 6000,
			}

			const response = await updateUserAndSMS(updatedObj, userExist);
			if (!response.success) {
				return res.status(500).json(response);
			}

			return res.status(200).json(response);
		}

		// create new acount if user does not exist before
		const newUser = await newAcct({name, phone});
		if (!newUser.success) {
			return res.status(500).json(newUser)
		}

		return res.status(200).json(newUser)

	} catch (_error) {
		return res.status(500).json({
			message: "An error occured when trying to confirm user",
			success: false
		})
	}
}


//new account methods
const newAcct = async ({name, phone}) => {
	let response = {};

	const token = Math.floor(Math.random() * 90000) + 10000;
	let currentDateObj = new Date();
	let currentminute = currentDateObj.getTime();
	let expire_time = currentminute + 3 * 60000

	await db.User.create({
		name,
		phone,
		expire_time,
		status: "unverified",
		token,
	}).then(async _user => {
		const smsResponse = await _sms({phone, token})

		response = {
			success: true,
			message: "User Registration Successful",
			smsResponse: smsResponse.message,
			data: {phone, id: _user.id}
		}
	}).catch(_error => {
		response = {
			success: false,
			message: "An error occured when inserting new user details"
		}
	})

	return response
};

const updateUserAndSMS = async (updatedObj, {id, phone}) => {
	let response = {}

	await db.User.update(updatedObj, {where: {id}}).then(async _user => {
		// send token through sms
		const smsResponse = await _sms({phone, token: updatedObj.token})
		response = {
			success: true,
			message: `Welcome back`,
			smsResponse: smsResponse.message,
			data: {phone, id}
		}

	}).catch(_error => {
		response = {
			message: "An error occured when trying to update user",
			success: false
		};
	})

	return response
}

// confirmation of otp###
const confirmOtpAndVerify = async (req, res) => {
	let {token, id} = req.body

	//getting the current minute##
	let currentDateObj = new Date();
	let currentminute = currentDateObj.getTime();
	try {
		const user = await db.User.findOne({where: {token, id}});
		if (!user) {
			return res.status(400).json({
				message: 'Invalid OTP',
				success: false
			})
		}

		if (currentminute > Number(user.expire_time)) {
			return res.status(400).json({
				message: 'The (OTP) code has expired',
				success: false
			})
		}

		user.set({status: "verified"});
		return user.save().then(user => {
			return res.status(200).json({
				data: user,
				message: 'Account Created Successfully',
				succuss: true
			})
		}).catch(error => {
			return res.status(200).json({
				success: false,
				message: "An error occured when marking user as verified"
			})
		});

	} catch (error) {
		return res.status(500).send({
			success: false,
			message: "An error occured when confirming user details"
		})
	}
}

const resendOtp = async (req, res) => {
	let {id, phone} = req.body
	const currentminute = new Date().getTime();
	const updatedObj = {
		token: Math.floor(Math.random() * 90000) + 10000,
		status: "unverified",
		expire_time: currentminute + 3 * 6000,
	}

	const response = await updateUserAndSMS(updatedObj, {id, phone});
	if (!response.success) {
		return res.status(500).json(response);
	}

	return res.status(200).json(response);
}

module.exports = {register, confirmOtpAndVerify, resendOtp}