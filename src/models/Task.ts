import mongoose, { Document } from "mongoose";


interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string,
    description: string,
    status: string,
    user: mongoose.Types.ObjectId
}

const taskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true

    }
}, { timestamps: true })


export default mongoose.model('Task', taskSchema)