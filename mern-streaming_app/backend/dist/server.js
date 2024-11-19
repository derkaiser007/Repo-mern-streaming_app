"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const path_1 = __importDefault(require("path"));
// import fs from 'fs';
dotenv_1.default.config();
(0, db_1.default)();
/*
fs.access('.env', fs.constants.R_OK, (err) => {
    if (err) {
      console.error('.env file is not readable:', err.message);
    } else {
      console.log('.env file is readable.');
    }
});
  
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
*/
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.resolve('uploads')));
app.use('/api/media', mediaRoutes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
