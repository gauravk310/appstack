import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
        },
        image: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation error in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
