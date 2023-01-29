//array for all registered user
const Message = require('../model/message');
const allUsers = []

//up

// gg();

const socket = (io)=>{
    io.on('connection', (socket)=>{
        console.log("user connect");

        socket.on('user_connect', (username)=>{    
            let filterUsers =  allUsers.filter(info=>info.receiver == username) 
            let findUser =  allUsers.find(info => info.receiver == username)

            if(filterUsers.length >= 1){
                let index = allUsers.indexOf(findUser)
                let user = { 
                            receiver : username, 
                            socket_id: socket.id 
                        }
                allUsers[index] = user
                console.log(allUsers[index],'yes', index)
            }else if(filterUsers.length == 0){
                let user = { receiver : username, socket_id: socket.id }
                allUsers.push(user)
            }
            console.log(allUsers);
            io.emit('users', allUsers)
        });

        //listen from client 
        //....expecting three things
        socket.on('send_message', async (data)=>{ 
            // data contain receiver, sender, and the message

            console.log(data);
            let getId = allUsers.find(each => (each.receiver === data.name));
            if(getId){  
                console.log(getId,'alluser')
                let socketId = getId.socket_id
                console.log(socketId, data.message)
                await socket.to(socketId).emit('messagetoID', data);     
            }
        })
        
        socket.on('disconnect', function(){
            console.log("disconnect")
        })

        //Typing socket method #### This is capable of firing a message to the receiver
        socket.on('typing', (res)=>{
            console.log('for typing', res);
             allUsers.find(e => {
                //  console.log('res.user', res)
                if(e.receiver === res.name){
                    socket.broadcast.to(e.socket_id).emit('user_typing', {...res, typing:'typing....'})   
                }else{
                    console.log('undefined');
                }
            })
        })

        socket.emit("welcome", "i see user here")
       
    });
    
}

module.exports = socket

