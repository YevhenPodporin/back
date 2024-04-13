import {
  Chat,
  editMessage,
  GetMessages,
  searchMessages,
  sendMessageType,
  SocketWithUser,
  UserTyping,
} from "../../types/ChatTypes";

import chatService from "../servises/chat.service";
import { io } from "../../app";
import * as fs from "fs";
import isValidFileType from "../../helpers/isValidFileType";
import { getImageUrl } from "../../helpers/getImageUrl";

const saveFileForMessage = (file: sendMessageType["file"]) => {
  if (!file) return null;
  const splitted = file.data.split(";base64,");
  let format = splitted[0].split("/")[1];
  if (format.includes("webm")) {
    format = format.split(";")[0];
  }

  if (!isValidFileType(format)) {
    throw new Error("Incorrect file format");
  }

  const newFileName =
    new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-") +
    "-" +
    file.fileName?.split(".")[0] +
    "." +
    format;

  fs.writeFileSync(
    process.cwd() + `/src/storage/files/${newFileName}`,
    splitted[1],
    { encoding: "base64" },
  );

  return newFileName;
};

const getRecipient = async (socket: SocketWithUser, room: Chat) => {
  const sockets = await io.sockets.sockets;
  const socketsToFind = [...sockets.values()] as SocketWithUser[];

  const toUserId =
    socket.user.id === room?.to_user_id ? room?.from_user_id : room?.to_user_id;

  const socketToSend = socketsToFind.find((data) => data.user.id === toUserId);
  return { socketToSend, toUserId };
};
const socketController = async (socket: SocketWithUser) => {
  let room: Chat;

  socket.on("joinRoom", async ({ id }) => {
    const foundRoom = await chatService.getRoom({
      id,
      from_user_id: Number(socket.user.id),
    });
    if (foundRoom) {
      room = foundRoom;
      socket.join(String(room.id));
    } else {
      socket.disconnect(true);
    }
  });

  socket.on("getMessages", async (data: GetMessages, callback) => {
    const messages = await chatService.getMessagesInChat({
      ...data,
      user: socket.user,
    });

    if (data.pagination?.skip === 0) {
      await chatService.removeNotification({
        to_chat_id: Number(data.chat_id),
        to_user_id: socket.user.id,
      });
    }

    callback(messages);
  });

  socket.on(
    "send-message",
    async (
      { file, message, chat_id }: sendMessageType,
      cb: (status: string) => string,
    ) => {
      if (!message && !file) return;

      if ((!socket.rooms.has(String(chat_id)) || !socket.user) && cb) {
        return cb("error");
      }

      try {
        const savedFileName = saveFileForMessage(file);
        const savedMessage = await chatService.createMessageInChat({
          message,
          file: savedFileName,
          chat_id: Number(chat_id),
          sender_id: Number(socket.user.id),
        });
        savedMessage.file = getImageUrl(savedMessage.file);

        const { toUserId, socketToSend } = await getRecipient(socket, room);

        if (
          !socketToSend ||
          (!socketToSend.rooms.has(String(chat_id)) && toUserId)
        ) {
          const notification = await chatService.addNotification({
            to_user_id: toUserId,
            to_chat_id: Number(chat_id),
          });
          io.to(String(socketToSend?.id)).emit("notification", {
            ...notification,
            message,
          });
        }

        if (socketToSend && !socketToSend.rooms.has(String(chat_id))) {
          io.to(String(chat_id)).emit("receive-message", savedMessage);
        } else {
          io.to(String(chat_id)).emit("receive-message", savedMessage);
          io.to(String(chat_id)).emit("stop-typing");
        }
      } catch (e) {
        console.log(e);
      }
    },
  );

  socket.on("typing", async ({ first_name, chat_id }: UserTyping) => {
    const { socketToSend } = await getRecipient(socket, room);
    if (socketToSend && socketToSend.rooms.has(String(chat_id))) {
      socket
        .to(chat_id)
        .emit("someoneTyping", { first_name, id: socket.user.id });
    } else {
      socket.to(chat_id).emit("stop-typing");
    }
  });

  socket.on("stop-typing", (chat_id: string) => {
    socket.to(chat_id).emit("stop-typing");
  });

  socket.on("searchMessages", async (data: searchMessages, callback) => {
    const messages = await chatService.searchInChat({
      ...data,
      user: socket.user,
    });
    callback(messages);
  });

  socket.on("editMessage", async (data: editMessage, callback) => {
    try {
      const savedMessage = await chatService.editMessage(data);

      io.to(String(data.chat_id)).emit("editMessage", savedMessage);
      callback("ok");
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("disconnect", async () => {
    socket.rooms.clear();
  });
};

export default socketController;