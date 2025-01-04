const express = require('express');
const app = express();
const userApi = require('./routes/user');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./connection/conn')

app.use(cookieParser());
app.use(express.json());
//all routes
app.use('/api/v1', userApi);

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log("server running on port", PORT);
})