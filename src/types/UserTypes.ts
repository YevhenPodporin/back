import {RequestStatus, Prisma} from "@prisma/client"

// TODO Поменять типы для интерфейсов взяв их из моделей Prisma
//  JWT payload поменять на нормальные поля из type JwtPayload
//  разбить типы на файлы

export interface UserRegisterRequestBody {
    email: Prisma.UsersCreateInput['email'],
    password: Prisma.UsersCreateInput['password'],
    first_name: Prisma.ProfileCreateInput['first_name'],
    last_name:  Prisma.ProfileCreateInput['last_name'],
    date_of_birth:  Prisma.ProfileCreateInput['date_of_birth'],
    file?: Express.Multer.File,
}

export interface UserRegisterWithoutFile extends Omit<UserRegisterRequestBody, 'file' | 'accessToken'> {}

export interface UserUpdateProfileBody extends  Omit<UserRegisterRequestBody, 'password'>{}

export type UserLoginRequestBody  = Pick<UserRegisterRequestBody, 'email'|'password'>

export interface PaginationParams {
    filter?: {
        status?: RequestStatus
        search?: string
    },
    pagination?: {
        take: number,
        skip: number,
        direction: Direction,
        order_by: OrderBy
    }
}

export enum OrderBy {
    created_at = 'created_at'
}

export enum Direction {
    desc = 'desc',
    asc = 'asc'
}

export interface RequestToFriend {
    from_user_id: string,
    to_user_id:  string,
    status: RequestStatus
}

export type JwtPayload = Pick<Prisma.UsersUncheckedCreateInput, 'email' | 'id'>
