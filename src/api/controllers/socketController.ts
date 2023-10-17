import {sendMessageType, SocketWithUser, UserTyping} from "../../types/ChatTypes";

import chatService from "../servises/chat.service";
import {io} from "../../app";
import * as fs from "fs";
import isValidFileType from "../../helpers/isValidFileType";
import {getImageUrl} from "../../helpers/getImageUrl";

const saveFileForMessage = (file: sendMessageType['file']) => {
    if (!file) return null;
    const splitted = file.data.split(';base64,');
    const format = splitted[0].split('/')[1];
    if (!isValidFileType(format)) return null;

    const newFileName = new Date().toISOString().replace(/:/g, '-')
        .replace(/\./g, '-') + '-' + file.fileName?.split('.')[0] + '.' + format


    fs.writeFileSync(process.cwd() + `/src/storage/files/${newFileName}`, splitted[1], {encoding: 'base64'});
    return newFileName
}

const socketController = async (socket: SocketWithUser) => {
    socket.on('join-room', async ({id, to_user_id}) => {
        const room = await chatService.getRoom({
            id,
            to_user_id,
            from_user_id: Number(socket.user.id)
        })
        if (room) {
            socket.rooms.add(String(room.id))

            socket.join(String(room.id))
        }
    })

    socket.on("send-message", async ({file, message, chat_id}: sendMessageType, cb: (status: string) => string) => {
        if (!socket.rooms.has(String(chat_id)) || !socket.user) {
            cb('error')
        }
        const savedFileName = saveFileForMessage(file)
        const savedMessage = await chatService.createMessageInChat({
            message,
            file: savedFileName,
            chat_id: Number(chat_id),
            sender_id: Number(socket.user.id)
        })
        savedMessage.file = getImageUrl(savedMessage.file);
        cb('oleg')
        io.sockets.to(String(chat_id)).emit("receive-message", savedMessage)
        io.sockets.to(String(chat_id)).emit('stop-typing')
    });

    socket.on('typing', ({first_name, chat_id}: UserTyping) => {
        socket.to(chat_id).emit('someoneTyping', {first_name, id: socket.user.id})
    })
    socket.on('stop-typing',(chat_id:string)=>{
        socket.to(chat_id).emit('stop-typing')
    })
}

export default socketController;
