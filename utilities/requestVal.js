const validationFails = (res, error) => {
	return res.status(400).json({
		message: error.message,
		success: false,
		error: error,
	})
}

module.exports = {validationFails}