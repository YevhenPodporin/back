import {Chat, GetMessages, sendMessageType, SocketWithUser, UserTyping} from "../../types/ChatTypes";

import chatService from "../servises/chat.service";
import {io} from "../../app";
import * as fs from "fs";
import isValidFileType from "../../helpers/isValidFileType";
import {getImageUrl} from "../../helpers/getImageUrl";
import {log} from "util";

const saveFileForMessage = (file: sendMessageType['file']) => {
    if (!file) return null;
    const splitted = file.data.split(';base64,');
    const format = splitted[0].split('/')[1];
    if (!isValidFileType(format)) return null;
    const newFileName = new Date().toISOString().replace(/:/g, '-')
        .replace(/\./g, '-') + '-' + file.fileName?.split('.')[0] + '.' + format

    console.time('start')
    fs.writeFileSync(process.cwd() + `/src/storage/files/${newFileName}`, splitted[1], {encoding: 'base64'});
    console.timeEnd('start')

    return newFileName
}

const socketController = async (socket: SocketWithUser) => {
    let room: Chat;

    socket.on('joinRoom', async ({id}) => {
        const foundRoom = await chatService.getRoom({
            id,
            from_user_id: Number(socket.user.id)
        })
        if (foundRoom) {
            room = foundRoom
            socket.join(String(room.id))
        }else{
            socket.disconnect(true)
        }
    })

    socket.on('getMessages', async (data: GetMessages, callback) => {
        const messages = await chatService.getMessagesInChat({...data, user: socket.user});
        callback(messages)
        if(data.pagination?.skip === 0){
            await chatService.removeNotification({
                to_chat_id:Number(data.chat_id),
                to_user_id:socket.user.id
            })
        }
    })

    socket.on("send-message", async ({file, message, chat_id}: sendMessageType, cb: (status: string) => string) => {
        if ((!socket.rooms.has(String(chat_id)) || !socket.user) && cb) {
            return cb('error')
        }
        const savedFileName = saveFileForMessage(file)
        const savedMessage = await chatService.createMessageInChat({
            message,
            file: savedFileName,
            chat_id: Number(chat_id),
            sender_id: Number(socket.user.id)
        })
        savedMessage.file = getImageUrl(savedMessage.file);

        const sockets = await io.sockets.sockets;
        const socketsToFind = [...sockets.values()] as SocketWithUser[];
        socketsToFind.forEach((value) => {
            // console.log(value.user.email, value.rooms)
        })

        const toUserId = socket.user.id === room?.to_user_id
            ? room?.from_user_id
            : room?.to_user_id

        const socketToSend = socketsToFind.find(data => data.user.id === toUserId)

        if (socketToSend && !socketToSend.rooms.has(String(chat_id))) {
            const newNotification = await chatService.addNotification({
                to_user_id:toUserId,
                to_chat_id:Number(chat_id),
            })

            io.to(String(socketToSend?.id)).emit("notification", `You have new message from ${socket.user.email}`)
            io.to(String(chat_id)).emit("receive-message", savedMessage)
        } else {
            io.to(String(chat_id)).emit("receive-message", savedMessage)
            io.to(String(chat_id)).emit('stop-typing')
        }
    });

    socket.on('typing', async ({first_name, chat_id}: UserTyping) => {
        const sockets = await io.sockets.sockets;
        const socketsToFind = [...sockets.values()] as SocketWithUser[];

        socketsToFind.forEach((value) => {
            // console.log(value.user.email, value.rooms)
        })

        const toUserId = socket.user.id === room?.to_user_id
            ? room?.from_user_id
            : room?.to_user_id

        const socketToSend = socketsToFind.find(data => data.user.id === toUserId);
        if(socketToSend && socketToSend.rooms.has(String(chat_id))){
            socket.to(chat_id).emit('someoneTyping', {first_name, id: socket.user.id})
        }else{
            socket.to(chat_id).emit('stop-typing')
        }
    })

    socket.on('stop-typing', (chat_id: string) => {
        socket.to(chat_id).emit('stop-typing')
    })

    socket.on('disconnect', async ()=>{
        socket.rooms.clear();
    })
}

export default socketController;

//TODO записать notifications в базу даже если юзер не подключен к сокету...