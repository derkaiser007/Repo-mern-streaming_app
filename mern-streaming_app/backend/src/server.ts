import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import mediaRoutes from './routes/mediaRoutes';
import path from 'path';
// import fs from 'fs';

dotenv.config();
connectDB();

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

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api/media', mediaRoutes);

const PORT = process.env.PORT!;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
