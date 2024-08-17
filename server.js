const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const fileUpload = require('express-fileupload');
const AuthenticationRoutes = require('./routes/AuthenticationRoutes')
const ProductRoutes = require('./routes/ProductRoutes')
const CardRoutes = require('./routes/CardRoutes');
const CartRoutes = require('./routes/CartRoutes')

const App = express()

App.use(cookieParser())
App.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET','POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))
App.use(express.json())
App.use(fileUpload({useTempFiles: true}));

    
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(()=>{console.log('MongoDB Connected')})
                
App.use('/', AuthenticationRoutes);
App.use('/', ProductRoutes);
App.use('/', CardRoutes);
App.use('/', CartRoutes);    

App.listen(5000, ()  => {
    console.log("Welcome to backend...")
})