import express, {Errback, Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import serverRoutes from "./api/routes/server_routes";
import rateLimit from 'express-rate-limit'
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
})
import cors from 'cors'
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3004;

app.use(cors());
app.use(limiter)
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', serverRoutes);
app.use('/image',express.static(process.cwd() + '/src/storage/files'))

app.use((err: Errback, req: Request, res: Response) => {
    res.status(500).json({
        status: 500,
        message: err
    })
})
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}...`);
});