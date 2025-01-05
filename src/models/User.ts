import mongoose, { Document, Schema } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    refreshToken?: string;
    generateAccessToken(): string;
    generateRefreshToken(): string;
    comparePassword(password: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 5,
        maxlength: 20,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'please provide a valid email'
        }

    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});


// hash the password before saving if password not modified return
userSchema.pre<IUser>('save', async function (next) {

    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()


})

//check if the hashed password is correct
userSchema.methods.comparePassword = async function (password: string) {

    try {

        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
        return false;
    }

}

//generates access token
userSchema.methods.generateAccessToken = function () {
    //  console.log(process.env)

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//generates refresh token

userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    return jwt.sign({
        _id: this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export default mongoose.model<IUser>('User', userSchema)