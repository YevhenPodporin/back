"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const server_routes_1 = __importDefault(require("./api/routes/server_routes"));
const cors = require('cors');
const fileUpload = require("express-fileupload");
const { dirname } = require('path');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3004;
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload({
    createParentPath: true,
    useTempFiles: true,
    safeFileNames: true,
    tempFileDir: 'storage'
}));
app.use('/api', server_routes_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}...`);
});
