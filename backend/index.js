const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app = express();
const pinRoutes=require('./routes/pins')
const userRoutes=require('./routes/users')
dotenv.config()

app.use(express.json())

mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));


app.use("/api/pins",pinRoutes) // Whenver we go to localhost and say api/pins it will direct us to pinRoute
app.use("/api/users",userRoutes)

app.listen(8000,()=>{
    console.log('Server started at 8000');
})