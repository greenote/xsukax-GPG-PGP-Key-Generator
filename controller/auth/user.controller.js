const jwt = require('jsonwebtoken')
const db = require("../../models");
const {_sms} = require('../../utilities/bulksms');

const register = async (req, res) => {
	const {name, phone} = req.body;

	//validate name and phone
	if (!(name && phone)) {
		return res.status(400).json({
			message: "Name and phone is required",
			success: false,
			error: true
		})
	}

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

			const updatedUser = await updateUserAndSMS(updatedObj, userExist);
			if (!updatedUser.success) {
				return res.status(500).json(updatedUser);
			}

			return res.status(200).json(updatedUser);
		}

		// create new acount if user does not exist before
		const newUser = await newAcct({name, phone});
		if (!newUser.success) {
			return res.status(500).json(newUser)
		}

		return res.status(200).json(newUser)

	} catch (_error) {
		console.log(_error);
		return res.status(500).json({
			message: "An error occured when trying to confirm user",
			error: true,
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
			smsResponse: smsResponse.message
		}
	}).catch(_error => {
		response = {
			success: false,
			error: true,
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
			error: false,
			message: `Welcome back`,
			smsResponse: smsResponse.message
		}

	}).catch(_error => {
		response = {
			message: "An error occured when trying to update user",
			error: true,
			success: false
		};
	})

	return response
}

module.exports = {register}