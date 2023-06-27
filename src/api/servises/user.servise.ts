import {PrismaClient, Prisma} from "@prisma/client";
import express from "express";
import {UserProfile} from "../../models/UserModel";
import {log} from "util";
const prisma = new PrismaClient();
const bcrypt = require('bcrypt')
const jwt = require('../../../utils/jwt.js');
require('dotenv').config();
const path = require('path');
class userService {
    static async getProfile(data:{payload:{email:string},currentUrl:string}) {
        const {email} = data.payload;
        try {
            let userProfile = await prisma.users.findFirst({
                where:{email},
                select:{email:true,profile:true}
            });
            const resProfile = {...userProfile?.profile, email}
            const file_path = resProfile.file_path
            // Construct the URL for the file
            const fileUrl = data.currentUrl + file_path;
            if(file_path){
                resProfile.file_path = fileUrl
            }
            return {error:null,...resProfile}
        }catch (e){
            if(e instanceof Prisma.PrismaClientKnownRequestError){
                return {error:`User with email:${email} not found`}
            }
        }
    }

}

export default userService;