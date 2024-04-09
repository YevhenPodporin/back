import {PrismaClient, RequestStatus} from "@prisma/client";
import {
    CreateChatType,
    CreateMessageType,
    editMessage,
    GetMessages,
    GetRoom,
    searchMessages
} from "../../types/ChatTypes";
import {getImageUrl} from "../../helpers/getImageUrl";
import {Notifications} from ".prisma/client";

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
        const list = await prisma.chats.findMany({
            where: {
                OR: [
                    {from_user: {id: +user_id}},
                    {to_user: {id: +user_id}}
                ],
            },
            include: {
                to_user: {select: {profile: true}},
                from_user: {select: {profile: true}},
                messages: {
                    orderBy: {created_at: 'desc'},
                    take: 1, select: {message: true},
                },
                notifications: {
                    where: {to_user_id: user_id},
                    select: {to_user_id: true, unread_messages: true}
                }
            }
        })

       return  list.map(item => {
            return {
                id: item.id,
                from_user: {
                    profile: {
                        ...item.from_user.profile,
                        file_path: getImageUrl(item.from_user.profile?.file_path)
                    }
                },
                to_user: {
                    profile: {
                        ...item.to_user.profile,
                        file_path: getImageUrl(item.to_user.profile?.file_path)
                    }

                },
                to_user_id: item.to_user_id,
                from_user_id: item.from_user_id,
                unread_messages: item.notifications[0]?.unread_messages,
                last_message: item.messages[0]?.message,
                created_at: item.created_at,
                updated_at: item.updated_at
            }
        })

    }

    public async getRoom({id, from_user_id}: GetRoom) {
        return prisma.chats.findFirst({
            where: {
                OR: [
                    {from_user: {id: +from_user_id}},
                    {to_user: {id: +from_user_id}}
                ],
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
                    {from_user_id: Number(user.id),},
                    {to_user_id: Number(user.id)},
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
        if (!messages) return {list: [], count: 0}
        const messagesToSend = messages.messages.map(message => {
            return {
                ...message,
                file: getImageUrl(message.file),
            }
        })
        return {list: messagesToSend, count: messages._count.messages}
    }

    public async addNotification(data: Omit<Notifications, 'unread_messages' | 'id'>) {
        return prisma.notifications.upsert({
            where: {
                to_chat_id_to_user_id: {
                    to_user_id: data.to_user_id,
                    to_chat_id: data.to_chat_id
                }
            }
            , create: {
                ...data,
                unread_messages: 1
            },
            update: {
                unread_messages: {increment: 1}
            }
        })
    }

    public async removeNotification(data: Omit<Notifications, 'unread_messages' | 'id'>) {
        await prisma.notifications.delete({
            where: {
                to_chat_id_to_user_id: {
                    to_user_id: data.to_user_id,
                    to_chat_id: data.to_chat_id
                }
            }
        }).catch(() => {
            console.log('Nothing to delete')
        })
    }

    public async searchInChat (data:searchMessages){
        const {chat_id, value, user} = data
        if (!user.id) return {error: ''}

        const messages = await prisma.messages.findMany({
            where: {
                chat_id: Number(chat_id),
                OR: [
                    {chat: {from_user_id: Number(user.id),}},
                    {chat: {to_user_id: Number(user.id)}},
                ],
                AND: {message: {contains:value}}
            },
            include:{user:true}
        })

        return messages.map(message => {
            return {
                ...message,
                user: {...message.user, file_path:getImageUrl(message.user.file_path)}
            }
        })
    }

    public async editMessage(data:editMessage){
        const message = prisma.messages.update({
            where:{id:data.message_id},
            data:{
                message:data.value,
                updated_at:new Date()
            }
        })

        return message;
    }
}

export default new chatService();