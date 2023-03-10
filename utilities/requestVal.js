const validationFails = (res, error) => {
	return res.status(422).json({
		message: error.message,
		success: false,
		error: error,
	})
}

module.exports = {validationFails}