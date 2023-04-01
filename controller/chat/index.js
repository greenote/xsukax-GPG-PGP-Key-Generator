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
				let index = allUsers.indexOf(findUser)
				let user = {
					userId,
					socketId: socket.id
				}
				allUsers[index] = user
				return
			}
			// if user not found, add to user array
			let user = {userId, socketId: socket.id}
			allUsers.push(user)
			socket.emit('GET-ACTIVE-USERS', allUsers)
		});

		socket.on('SEND-MESSAGE', (data) => {
			// get the receiver socket id
			let receiver = allUsers.find(each => (each.userId == data.receiverId));
			if (receiver) {
				socket.to(receiver.socketId).emit('RECEIVE-MESSAGE', data);
			}
		})

		socket.on('disconnect', function () {
			let findUser = allUsers.find(each => each.socketId == socket.id)
			if (findUser) {
				let index = allUsers.indexOf(findUser)
				allUsers.splice(index, 1);
			}
		})

		//Typing socket method #### This is capable of firing a message to the receiver
		// socket.on('typing', (res) => {
		// 	console.log('for typing', res);
		// 	allUsers.find(e => {
		// 		//  console.log('res.user', res)
		// 		if (e.receiver === res.name) {
		// 			socket.broadcast.to(e.socket_id).emit('user_typing', {...res, typing: 'typing....'})
		// 		} else {
		// 			console.log('undefined');
		// 		}
		// 	})
		// })

		// socket.emit("welcome", "i see user here")

	});

}

module.exports = socket

