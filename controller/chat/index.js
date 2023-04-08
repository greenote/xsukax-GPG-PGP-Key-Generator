//array for all users using socket
const allUsers = []

const socket = (io) => {
	io.on('connection', (socket) => {
		// connect user to socket 
		socket.on('CONNECT-USER', ({userId}) => {
			// try to get the user either with socket id or user id
			let findUser = allUsers.find(each => (each.userId == userId || each.socketId == socket.id))

			// if user found update socketId
			if (findUser) {
				const index = allUsers.indexOf(findUser)
				let user = {
					userId,
					socketId: socket.id
				}
				allUsers[index] = user
				return
			}
			// if user not found, add to user array
			const user = {userId, socketId: socket.id}
			allUsers.push(user)
			socket.emit('GET-ACTIVE-USERS', allUsers)
		});

		socket.on('SEND-MESSAGE', (data) => {
			// get the receiver socket id
			const receiver = allUsers.find(each => (each.userId == data.receiverId));
			if (receiver) {
				socket.to(receiver.socketId).emit('RECEIVE-MESSAGE', data);
			}
		})

		// Typing socket method #### This is capable of firing a message to the receiver
		socket.on('I-AM-TYPING', (data) => {
			const receiver = allUsers.find(each => (each.userId == data.receiverId));
			if (receiver) {
				socket.to(receiver.socketId).emit('USER-IS-TYPING', data);
			}
		})

		socket.on('disconnect', function () {
			const findUser = allUsers.find(each => each.socketId == socket.id)
			if (findUser) {
				const index = allUsers.indexOf(findUser)
				allUsers.splice(index, 1);
			}
		})
	});

}

module.exports = socket

