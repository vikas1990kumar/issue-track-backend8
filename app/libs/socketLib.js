/**
 * modules dependencies.
 */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib')
//const ChatModel = mongoose.model('Chat');

const UserModel = mongoose.model('User')
const IssueModel = mongoose.model('Issue')

const CommentsModel = mongoose.model('Comments')
const Watcher1Model = mongoose.model('Watch1')

let setServer = (server) => {

    let allOnlineUsers = []

    let allIssueUsers =[]

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection',(socket) => {

        console.log("on connection--emitting verify user");

        socket.emit("verifyUser", "");

        // code to verify the user and make him online

        socket.on('set-user',(authToken) => {

            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else{

                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);

                    this.allOnlineUsers =[];
                    let userObj = {userId:currentUser.userId,fullName:fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)

                    // setting room name
                    socket.room = 'edIssue'
                    // joining chat-group room.
                    socket.join(socket.room)
                    //console.log(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);

                }


            })
          
        }) // end of listening set-user event

        socket.on('subscribe-issue', (data) => {

            if (data == null){
                console.log("No issues available or no data found")
            }
              else{
            console.log("subscribe to issue called");

            for(let x of data){
                
                socket.join(`${x.issueId}`)
                console.log(x.issueId)
            }
        }    

        });


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


            var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)

            socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);
            socket.leave(socket.room)



        }) // end of on disconnect


        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            console.log(data);
            data['chatId'] = shortid.generate()
            console.log(data);

            // event to save chat.
            setTimeout(function(){
                eventEmitter.emit('save-chat', data);

            },2000)
            myIo.emit(data.receiverId,data)

        });

        socket.on('change-issue', (data) => {

            console.log("socket change-issue called")
            console.log(data);
           // data['issueId'] = shortid.generate()
            //console.log(data);        

            let userObj = {reporter:data.reporter,assignedTo:data.assignedTo}
                    allIssueUsers.push(userObj)
                    console.log(allIssueUsers)

                    
                    console.log(data.issueId);
                    console.log(`${data.issueId}`);
                   //socket.join(roomOfIssue)
                   socket.to(`${data.issueId}`).broadcast.emit('issue-edit-details',data);
                   //socket.to(data.issueId).broadcast.emit('issue-edit-details', data);
                    //io.of('/').to(roomOfIssue).emit('issue-edit-details', result[0]);
                   //myIo.to(`${roomOfIssue}`).emit('issue-edit-details', result[0]);
                    myIo.emit('issue-edit-details', data)
                    
            }

    );


    socket.on('comment-issue', (data) => {

        console.log("socket comment-issue called")
        console.log(data);
       // data['issueId'] = shortid.generate()
        //console.log(data);        


                
                console.log(data.data.issueId);
                console.log(`${data.data.issueId}`);
               //socket.join(roomOfIssue)
               socket.to(`${data.data.issueId}`).broadcast.emit('issue-comment-details',data);
               //socket.to(data.issueId).broadcast.emit('issue-edit-details', data);
                //io.of('/').to(roomOfIssue).emit('issue-edit-details', result[0]);
               //myIo.to(`${roomOfIssue}`).emit('issue-edit-details', result[0]);
                myIo.emit('issue-comment-details', data)
                
        }

);

        

        socket.on('subscribe-issues', (data) => {

            console.log("subscribtion to issue called");

            
                socket.room = data;
                socket.join(socket.room)
                console.log(socket.room)
           
                
            //console.log(data.issueId)
            

        });


        socket.on('typing', (fullName) => {
            
            socket.to(socket.room).broadcast.emit('typing',fullName);

        });




    });

}


// database operations are kept outside of socket.io code.

// saving chats to database.
eventEmitter.on('save-chat', (data) => {

    // let today = Date.now();

    let newChat = new ChatModel({

        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn

    });

    newChat.save((err,result) => {
        if(err){
            console.log(`error occurred: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });

}); // end of saving chat.

module.exports = {
    setServer: setServer
}
