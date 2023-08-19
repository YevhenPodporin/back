import express, {Errback, Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import serverRoutes from "./api/routes/server_routes";
import upload from './middlewares/storageUpload';

import sendFile from "./middlewares/sendFile";
import router from "./api/routes/server_routes";

const cors = require('cors')
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3004;

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


app.use('/api', serverRoutes);
// app.use(express.static(process.cwd() + '/src/storage/files'))


app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
    console.log(err, '111111111111111111')
    res.status(500).json({
        status: 500,
        message: err
    })
})
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}...`);
});