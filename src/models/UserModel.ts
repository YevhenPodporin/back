
export interface UserRegisterRequestBody {
    email:string,
    password:string,
    first_name:string,
    last_name:string,
    date_of_birth?:string,
    file?:Express.Multer.File,
    accessToken?:string
}
export interface UserLoginRequestBody {
    email:string,
    password:string,
}
export interface UsersModel extends Array<UserRegisterRequestBody>{
}

export interface UserProfile {
    email?:string,
    first_name?:string,
    last_name?:string,
    file_path?:string,
    is_online?:boolean,
    [propName: string]: any;
}