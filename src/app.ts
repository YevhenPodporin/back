import express, {Errback, Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import serverRoutes from "./api/routes/server_routes";
import rateLimit from 'express-rate-limit';
import passport from "passport";
import {OAuth2Strategy } from "passport-google-oauth"
import session from "express-session";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
import cors from 'cors'
import {createServer} from "http";
import socketMiddleware from "./middlewares/socketMiddleware";
import socketController from "./api/controllers/socketController";
import {Server} from "socket.io";
import {SocketWithUser} from "./types/ChatTypes";
import {verifyAccessToken} from "./utils/jwt";
import jwt from "jsonwebtoken";
import {JwtPayload} from "./types/UserTypes";


const app: Express = express();
const port = process.env.PORT || 4000;

const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: '*'
    },
    maxHttpBufferSize: 1e8
});

io.use((socket, next) => socketMiddleware(socket as SocketWithUser, next))
io.on('connection', (socket) => socketController(socket as SocketWithUser));

app.use(cors({origin: '*'}));
app.use(limiter)
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', serverRoutes);
app.use('/image', (req, res) => {
    res.download(process.cwd() + '/src/storage/files' + req.url)
})

let userProfile: any;
passport.serializeUser((user, cb) => {
    cb(null, user)
})
passport.serializeUser((obj, cb) => {
    cb(null, obj)
})
passport.use(new OAuth2Strategy({
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: 'http://localhost:4000/auth/google/callback',
    passReqToCallback:true
}, (req, accessToken, refreshToken, profile, done) => {
    userProfile = profile;
    return done(null, {userProfile, accessToken});
}))

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/error'}), (req, res) => {
        console.log(req)
    res.status(200).json(userProfile)
    }
)

app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        status: 500,
        message: err
    })
    next();
})

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}...`);
});

//TODO доделать гугл авторизацию