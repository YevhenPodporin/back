import {PrismaClient, Prisma, RequestStatus} from "@prisma/client";
import {JwtPayload, PaginationParams, RequestToFriend} from "../../types/UserTypes";
import {getImageUrl} from "../../helpers/getImageUrl";

const prisma = new PrismaClient();
require('dotenv').config();

class networkService {

    public async getMyFriends({user, params}: {
        user: JwtPayload,
        currentUrl: string,
        params: PaginationParams
    }) {
        const {filter, pagination} = params;
        const words = filter?.search && filter?.search.trim().split(' ') || '';
        const status = filter?.status;

        const friendIds = async () => {
            const friendRequests = await prisma.friends.findMany({
                where: {
                    OR: [
                        {to_user_id: user.id},
                        {from_user_id: status === 'APPROVED' ? user.id : undefined}
                    ], AND: {status: RequestStatus.APPROVED}
                },
            });

            return friendRequests.map((request) => {
                if (request.from_user_id === user.id) {
                    return +request.to_user_id
                } else {
                    return +request.from_user_id
                }
            });
        }
        const query: Prisma.ProfileFindManyArgs = {
            where: {
                NOT: {user: {id:user.id}},
                OR: filter?.search && filter?.search?.length > 0 ? [
                    {first_name: {contains: words[0]}},
                    {last_name: {contains: words[0]}},
                    {first_name: {contains: words[1]}},
                    {last_name: {contains: words[1]}},
                ] : undefined,
            },
            take: Number(pagination?.take),
            skip: Number(pagination?.skip),
            orderBy: {
                [pagination?.order_by || 'created_at']: pagination?.direction
            },
        };
        // Получить идентификаторы пользователей, отправивших запросы (статус REQUEST)
        // Фильтрация по статусу и идентификаторам друзей
        query.where!.user_id = {
            in: await friendIds(),
        } as Prisma.IntFilter;

        try {
            const [list, count] = await prisma.$transaction([
                prisma.profile.findMany(query),
                prisma.profile.count({where: query.where})
            ]);
            const userList = list.map(user => ({
                ...user,
                file_path: getImageUrl(user?.file_path)
            }))
            return {list: userList, count};
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${user.email} not found`};
            }
        }

    }

    public async getRequests({user, params, currentUrl}: {
        user: JwtPayload,
        currentUrl: string,
        params: PaginationParams
    }) {
        const {filter, pagination} = params;
        const words = filter?.search && filter?.search.trim().split(' ') || '';
        const friendIds = async () => {
            const friendRequests = await prisma.friends.findMany({
                where: {
                    OR: [
                        {to_user_id: user.id},
                    ], AND: {status: RequestStatus.REQUEST}
                },
            });

            return friendRequests.map((request) => {
                if (request.from_user_id === user.id) {
                    return +request.to_user_id
                } else {
                    return +request.from_user_id
                }
            });
        }
        const query: Prisma.ProfileFindManyArgs = {
            where: {
                NOT: {user: {id: user.id}},
                OR: filter?.search && filter?.search?.length > 0 ? [
                    {first_name: {contains: words[0]}},
                    {last_name: {contains: words[0]}},
                    {first_name: {contains: words[1]}},
                    {last_name: {contains: words[1]}},
                ] : undefined,
            },
            take: Number(pagination?.take),
            skip: Number(pagination?.skip),
            orderBy: {
                [pagination?.order_by || 'created_at']: pagination?.direction
            },
        };

        query.where!.user_id = {
            in: await friendIds(),
        } as Prisma.IntFilter;

        try {
            const [list, count] = await prisma.$transaction([
                prisma.profile.findMany(query),
                prisma.profile.count({where: query.where})
            ]);
            const userList = list.map(user => ({
                ...user,
                file_path: user.file_path ? currentUrl + user.file_path : null
            }))
            return {list: userList, count};
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${user.email} not found`};
            }
        }
    }

    public async getAllUsers({user, params, currentUrl}: {
        user: JwtPayload,
        currentUrl: string,
        params: PaginationParams
    }) {
        const {filter, pagination} = params;
        const words = filter?.search && filter?.search.trim().split(' ') || '';
        const status = filter?.status;

        const friendIds = async () => {
            const friendRequests = await prisma.friends.findMany({
                where: {
                    OR: [
                        {to_user_id: user.id},
                        {from_user_id: user.id }
                    ], AND: {OR: [{status:  RequestStatus.APPROVED}, {status: RequestStatus.REQUEST}]}
                },
            });

            return friendRequests.map((request) => {
                if (request.from_user_id === user.id) {
                    return +request.to_user_id
                } else {
                    return +request.from_user_id
                }
            });
        }
        const query: Prisma.ProfileFindManyArgs = {
            where: {
                NOT: {user: {id: user.id}},
                OR: filter?.search && filter?.search?.length > 0 ? [
                    {first_name: {contains: words[0]}},
                    {last_name: {contains: words[0]}},
                    {first_name: {contains: words[1]}},
                    {last_name: {contains: words[1]}},
                ] : undefined,
            },
            take: Number(pagination?.take),
            skip: Number(pagination?.skip),
            orderBy: {
                [pagination?.order_by || 'created_at']: pagination?.direction
            },
        };

        if (status) {
            // Получить идентификаторы пользователей, отправивших запросы (статус REQUEST)
            // Фильтрация по статусу и идентификаторам друзей
            query.where!.user_id = {
                in: await friendIds(),
            } as Prisma.IntFilter;
        } else {
            query.where!.user_id = {
                not: {in: await friendIds()},
            } as Prisma.IntFilter;
        }

        try {
            const [list, count] = await prisma.$transaction([
                prisma.profile.findMany(query),
                prisma.profile.count({where: query.where})
            ]);
            const userList = list.map(user => ({
                ...user,
                file_path: user.file_path ? currentUrl + user.file_path : null
            }))
            return {list: userList, count};
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${user.email} not found`};
            }
        }
    }

    public async addToFriend(data: RequestToFriend) {
        const {status, to_user_id, from_user_id} = data
        try {
            const isHasRequest = await prisma.friends.findFirst({
                where: {
                    OR: [
                        {
                            from_user_id: +from_user_id,
                            AND: {to_user_id: +to_user_id}
                        },
                        {
                            from_user_id: +to_user_id,
                            AND: {to_user_id: +from_user_id}
                        },
                    ],
                    status: {
                        in: [RequestStatus.REQUEST, RequestStatus.APPROVED]
                    }
                }
            })
            if (isHasRequest) {
                if (status === RequestStatus.REJECTED) {
                    await prisma.friends.delete({
                        where: {id: isHasRequest.id},
                    })
                    return {errors: null, message: isHasRequest.status === RequestStatus.REQUEST?'Request was dismissed successful': 'User removed from your friends successful'}
                } else if (status === RequestStatus.APPROVED && isHasRequest.from_user_id === +to_user_id) {
                    await prisma.friends.update({
                        where: {id: isHasRequest.id},
                        data: {status: RequestStatus.APPROVED}
                    })
                } else if (isHasRequest.status === RequestStatus.REQUEST || isHasRequest.status === RequestStatus.APPROVED) {
                    return {errors: 'You are friends already'}
                }
                if (status === RequestStatus.APPROVED || status === RequestStatus.REQUEST) {
                    await prisma.friends.update({
                        where: {id: isHasRequest.id},
                        data: {status: RequestStatus.APPROVED}
                    })
                }
            } else {
                if (status === RequestStatus.REQUEST) {
                    await prisma.friends.create({
                        data: {
                            from_user_id: +data.from_user_id,
                            to_user_id: +data.to_user_id,
                            status: data.status
                        }
                    })
                } else {
                    return {errors: `Incorrect status, should be:${RequestStatus.REQUEST}`}
                }
            }
            return {errors: null, message: 'Request was send successful'}
        } catch (e) {
            return {errors: e}
        }
    }
}

export default new networkService();