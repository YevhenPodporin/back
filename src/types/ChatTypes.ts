import {Chats, Prisma, Profile} from "@prisma/client";
import {Socket} from "socket.io";
import {Direction, JwtPayload, OrderBy} from "./UserTypes";
import {Notifications} from ".prisma/client";

export type CreateChatType = {
    from_user_id: Prisma.ChatsUncheckedCreateInput['from_user_id'],
    to_user_id: Prisma.ChatsUncheckedCreateInput['to_user_id'],
}

export interface GetRoom {
    id:Prisma.ChatsUncheckedCreateInput['id']
    from_user_id: Prisma.ChatsUncheckedCreateInput['from_user_id'],
}
export interface SocketWithUser extends Socket {
    user: JwtPayload
}
export type CreateMessageType = {
    chat_id:Prisma.MessagesUncheckedCreateInput['chat_id'],
    sender_id:Prisma.MessagesUncheckedCreateInput['sender_id'],
    message:Prisma.MessagesUncheckedCreateInput['message'],
    file:Prisma.MessagesUncheckedCreateInput['file']
}

export type sendMessageType = {
    message:string,
    chat_id:Pick<CreateMessageType, 'chat_id'>
    file?: {
        data:string,
        fileName:string | undefined
    }
}

export type UserTyping = {
    first_name:string,
    chat_id:string
}
export type GetMessages = {
    chat_id:Prisma.MessagesUncheckedCreateInput['chat_id'],
    pagination?:{
        take: number,
        skip: number,
        direction: Direction,
        order_by: OrderBy
    }
    user:JwtPayload
}
export interface Chat extends Prisma.ChatsUncheckedCreateInput{}

export interface ChatListResponse extends Chats{
    to_user: { profile:Profile },
    from_user: {profile: Profile },
    last_message:string,
    unread_messages:number
}