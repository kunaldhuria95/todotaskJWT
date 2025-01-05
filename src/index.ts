import express from "express"
import connectDb from "./db/connect";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import notFound from "./middlewares/not-found";
import errorHandlerMiddleware from "./middlewares/error-handler";
import authRoutes from './routes/authRoutes'
import taskRoutes from './routes/taskRoutes'
import morgan from 'morgan'
dotenv.config()

const app = express();

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/tasks', taskRoutes)
app.use('*', notFound)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000
const start = async () => {
    try {

        await connectDb(process.env.MONGO_URL!)
        app.listen(PORT, () => { console.log(`server is listening to ${PORT}`) })
    } catch (error: any) {
        console.log(error.message)
    }
}

start();