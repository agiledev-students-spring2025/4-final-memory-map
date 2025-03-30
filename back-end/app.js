// import express and middlware dependencies
import { express } from "express";
import path from 'path';
import { fileURLToPath } from "url";
import multer from 'multer';
import axios from "axios";
import dotenv from 'dotenv';
import morgan from "morgan";

// instantitiate express
const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use dotenv middleware
dotenv.config({ silent: true });

// use morgan middleware
app.use(morgan('dev'));

// use express body-parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('static', express.static('public'));


// put some server logic here later...

export default app;