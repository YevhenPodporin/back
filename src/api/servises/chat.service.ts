import {PrismaClient, RequestStatus} from "@prisma/client";
import {CreateChatType, CreateMessageType, GetMessages, GetRoom} from "../../types/ChatTypes";
import {getImageUrl} from "../../helpers/getImageUrl";

const prisma = new PrismaClient();
require('dotenv').config();

class chatService {
    queryOr = (data: CreateChatType) => {
        return [
            {
                from_user_id: +data.from_user_id,
                AND: {to_user_id: +data.to_user_id}
            },
            {
                from_user_id: +data.to_user_id,
                AND: {to_user_id: +data.from_user_id}
            },
        ]
    }

    public async createChat(data: CreateChatType) {
        const isMyFriend = await prisma.friends.findFirst({
            where: {
                OR: this.queryOr(data),
                AND: {status: RequestStatus.APPROVED}
            }
        })

        if (!isMyFriend) {
            return {error: 'You are not a friends'}
        }

        const isExistAlready = await prisma.chats.findFirst({
            where: {
                OR: this.queryOr(data)
            }
        })

        if (isExistAlready) {
            return {error: null, chat: isExistAlready}
        }

        const createdChat = await prisma.chats.create({
            data: {
                from_user_id: +data.from_user_id,
                to_user_id: +data.to_user_id,
            }
        })

        return {error: null, chat: createdChat}
    }

    public async getChatList(user_id: number) {
        return   prisma.chats.findMany({
            where: {
                OR: [
                    {from_user: {id: +user_id}},
                    {to_user: {id: +user_id}}
                ],
            },
            include: {
                to_user: {select: {profile: true}},
                from_user: {select: {profile: true}}
            }
        })

    }

    public async getRoom({id, from_user_id, to_user_id}: GetRoom) {
        return prisma.chats.findFirst({
            where: {
                OR: this.queryOr({to_user_id, from_user_id}),
                AND: {id: Number(id)}
            }
        })
    }

    public async createMessageInChat(data: CreateMessageType) {
        return prisma.messages.create({
            data
        })
    }

    public async getMessagesInChat(params: GetMessages) {
        const {chat_id, pagination, user} = params
        if (!user.id) return {error: ''}
        const messages = await prisma.chats.findFirst({
            where: {
                id: Number(chat_id),
                OR: [
                    {from_user_id: +user.id,},
                    {to_user_id: +user.id},
                ],
            },
            select: {
                messages: {
                    take: Number(pagination?.take),
                    skip: Number(pagination?.skip),
                    orderBy: {
                        [pagination?.order_by || 'created_at']: pagination?.direction
                    },
                },
                _count: true,
            },
        })
        if (!messages) return {}
        const messagesToSend = messages.messages.map(message => {
            return {
                ...message,
                file: getImageUrl(message.file),
            }
        })
        return {list:messagesToSend, count:messages._count.messages}
    }
}

export default new chatService();