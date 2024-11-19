"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/*
const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediaapp';
    await mongoose.connect(MONGO_URI); // Connect to MongoDB
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // Handle the error with proper logging
    console.error('❌ MongoDB connection failed:', error instanceof Error ? error.message : error);
    process.exit(1); // Exit the process
  }
};
*/
const connectDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (retries = 5) {
    const MONGO_URI = process.env.MONGO_URI;
    while (retries) {
        try {
            yield mongoose_1.default.connect(MONGO_URI);
            console.log('✅ MongoDB connected successfully');
            break; // Exit loop on successful connection
        }
        catch (error) {
            console.error(`❌ MongoDB connection failed. Retries left: ${retries - 1}`, error);
            retries -= 1;
            if (!retries) {
                process.exit(1); // Exit process if all retries fail
            }
            yield new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
        }
    }
});
// Retry is particularly useful in production environments where network issues may occur temporarily.
exports.default = connectDB;
