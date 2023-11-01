import {
    RequestStatus,
    Prisma,
    Users, Profile
} from "@prisma/client"

// TODO Поменять типы для интерфейсов взяв их из моделей Prisma
//  JWT payload поменять на нормальные поля из type JwtPayload
//  разбить типы на файлы

export interface UserRegisterRequestBody {
    email: Users['email'],
    password: Users['password'],
    first_name: Profile['first_name'],
    last_name:  Profile['last_name'],
    date_of_birth:  Profile['date_of_birth'],
    file?: Express.Multer.File,
    google_id?:Users['google_id']
}

export interface UserRegisterWithoutFile extends Omit<UserRegisterRequestBody, 'file' | 'accessToken' | 'google_id'> {}

export interface UserUpdateProfileBody extends  Omit<UserRegisterRequestBody, 'password' | 'google_id'>{}
export interface UserUpdateProfileBodyWithoutFile extends  Omit<UserRegisterRequestBody, 'password'|'file' | 'google_id'>{}

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

export type JwtPayload = {
    email:Users['email'],
    id:Users['id'],
}
