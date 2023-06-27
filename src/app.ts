import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import serverRoutes from "./api/routes/server_routes";
import multer from "multer";
import {fileFilter, fileStorage} from "../middlewares/storageUpload";
import sendFile from "../middlewares/sendFile";
const cors = require('cors')
dotenv.config();
const { Readable } = require('stream');
const myReadable = new Readable();

const app: Express = express();
const port = process.env.PORT || 3004;

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
app.use('/api',serverRoutes);
// app.use(express.static('./storage/files'))

app.use((req:Request, res:Response, next:NextFunction)=>sendFile(req,res,next))

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}...`);
});