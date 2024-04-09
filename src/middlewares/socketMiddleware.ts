import {verifyAccessToken} from "../utils/jwt";
import userService from "../api/servises/user.service";
import {ExtendedError} from "socket.io/dist/namespace";
import {SocketWithUser} from "../types/ChatTypes";

const socketMiddleware = (socket: SocketWithUser, next: (err?: ExtendedError) => void) => {
    if (!socket.handshake.auth.token) {
        return socket.disconnect();
    }

    verifyAccessToken(socket.handshake.auth.token).then(async (user) => {
        if(user.id){
            await userService.setStatusIsOnline({user_id: user.id, is_online: true})
            socket.user = user;
            next();
        }
    }).catch(() => {
       socket.disconnect();
    })
};

export default socketMiddleware;