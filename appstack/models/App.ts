import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApp extends Document {
    name: string;
    description: string;
    logo: string;
    link: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const AppSchema: Schema<IApp> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'App name is required'],
            trim: true,
            maxlength: [50, 'name cannot exceed 50 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        logo: {
            type: String,
            required: [true, 'Logo URL is required'],
            trim: true,
        },
        link: {
            type: String,
            required: [true, 'App link is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation error in development
const App: Model<IApp> = mongoose.models.App || mongoose.model<IApp>('App', AppSchema);

export default App;
