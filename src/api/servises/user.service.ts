import {PrismaClient, Prisma} from "@prisma/client";
import {JwtPayload, UserUpdateProfileBody} from "../../types/UserTypes";
import unlinkFIleByName from "../../helpers/unlinkFIleByName";
import {getImageUrl} from "../../helpers/getImageUrl";

const prisma = new PrismaClient();
require('dotenv').config();

class userService {
    public async setStatusIsOnline({user_id, is_online}: { user_id: number, is_online: boolean }) {
        await prisma.profile.update({
            where: {user_id}, data: {is_online}
        })
    }

    public async findUser(data:{id?:number, google_id?:number | string}) {
            return prisma.users.findFirst({
                where: data.google_id?{
                    google_id: String(data.google_id)
                }:{
                    id: data.id
                },
                select: {id:true,email:true}
            })

    }

    public async getProfile( id: number ) {
        try {
            let userProfile = await prisma.users.findFirst({
                where: {id},
                select: {email: true, profile: true}
            });
            if (userProfile) {
                const resProfile = {...userProfile?.profile, email: userProfile.email}
                const file_path = resProfile.file_path
                // Construct the URL for the file
                if (file_path) {
                    resProfile.file_path = getImageUrl(file_path)
                }
                return {...resProfile}
            }
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                return {error: `User with email:${id} not found`}
            }
        }
    }

    public async editProfile({body, user}: {
        body: UserUpdateProfileBody,
        user: JwtPayload
    }) {
        const {email, id} = user
        try {
            if (email) {
                let userProfile = await prisma.users.findFirst({
                    where: {
                        id,
                    }, include: {profile: true}
                })
                if (userProfile && userProfile.profile) {
                    if (userProfile.profile.file_path && body.file) {
                        await unlinkFIleByName(userProfile.profile.file_path)
                    }
                    const updatedProfile = await prisma.users.update({
                        where: {
                            id,
                        }, data: {
                            email: body.email,
                            profile: {
                                update: {
                                    first_name: body.first_name,
                                    last_name: body.last_name,
                                    file_path: body.file ? body.file.filename : undefined,
                                    is_online: true,
                                    date_of_birth: body.date_of_birth,
                                }
                            }
                        }, select: {email: true, profile:true}
                    })
                    if(updatedProfile.profile){
                        const file_path = updatedProfile.profile.file_path
                        if (file_path) {
                            updatedProfile.profile.file_path = getImageUrl(file_path)
                        }
                        return {...updatedProfile?.profile, email: updatedProfile.email}
                    }
                }

            }
        } catch (e) {
            return {error: e}
        }
    }
}

export default new userService();