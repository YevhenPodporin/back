import {PrismaClient, Prisma} from "@prisma/client";
import {UserUpdateProfileBody} from "../../types/UserTypes";

const prisma = new PrismaClient();
require('dotenv').config();
const fs = require('fs');

class userService {
    public async setStatusIsOnline({user_id, is_online}: { user_id: number, is_online: boolean }) {
         await prisma.profile.update({
            where:{user_id}, data:{is_online}
        })
    }

    public async getProfile({email, currentUrl}: { email: string, currentUrl: string }) {
        try {
            let userProfile = await prisma.users.findFirst({
                where: {email},
                select: {email: true, profile: true}
            });
            const resProfile = {...userProfile?.profile, email}
            const file_path = resProfile.file_path
            // Construct the URL for the file
            const fileUrl = currentUrl + file_path;
            if (file_path) {
                resProfile.file_path = fileUrl
            }
            return {...resProfile}
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${email} not found`}
            }
        }
    }

    public async editProfile({email, file, user}: {
        user: UserUpdateProfileBody,
        email: string,
        file: Express.Multer.File | null
    }) {
        try {
            if (email) {
                let userProfile = await prisma.users.findFirst({
                    where: {
                        email
                    }, include: {profile: true}
                })
                if (userProfile && userProfile.profile && file && email) {
                    if (userProfile.profile.file_path) {
                        fs.unlinkSync(userProfile.profile.file_path)
                    }
                    await prisma.users.update({
                        where: {
                            email
                        }, data: {
                            email, profile: {
                                update: {
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    file_path: file.path,
                                    is_online: true,
                                    date_of_birth: user.date_of_birth,
                                }
                            }
                        }
                    })
                }
                return {error: null, userProfile};
            }
        } catch (e) {
            return {error: e}
        }

    }
}

export default new userService();