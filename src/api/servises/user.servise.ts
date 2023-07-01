import {PrismaClient, Prisma} from "@prisma/client";
import express from "express";
import {UserProfile, UserUpdateProfileBody} from "../../models/UserModel";

const prisma = new PrismaClient();
require('dotenv').config();
const fs = require('fs');

class userService {
    static async getProfile(data: { payload: { email: string }, currentUrl: string }) {
        const {email} = data.payload;
        try {
            let userProfile = await prisma.users.findFirst({
                where: {email},
                select: {email: true, profile: true}
            });
            const resProfile = {...userProfile?.profile, email}
            const file_path = resProfile.file_path
            // Construct the URL for the file
            const fileUrl = data.currentUrl + file_path;
            if (file_path) {
                resProfile.file_path = fileUrl
            }
            return {error: null, ...resProfile}
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${email} not found`}
            }
        }
    }

    static async editProfile(data: { user: UserUpdateProfileBody, file: Express.Multer.File | null }) {
        try{
            if (data.user.payload) {
                const email = data.user.payload.email
                let userProfile = await prisma.users.findFirst({
                    where: {
                        email
                    }, include: {profile: true}
                })
                if (userProfile && userProfile.profile && data.file && email) {
                    if (userProfile.profile.file_path) {
                        fs.unlinkSync(userProfile.profile.file_path)
                    }
                    await prisma.users.update({
                        where: {
                            email
                        }, data: {
                            email, profile: {
                                update: {
                                    first_name: data.user.first_name,
                                    last_name: data.user.last_name,
                                    file_path:data.file.path,
                                    is_online:true,
                                    date_of_birth:data.user.date_of_birth,
                                }
                            }
                        }
                    })
                }
                return {error:null,userProfile};
            }
        }catch (e){
            return  {error:e}
        }

    }
}

export default userService;