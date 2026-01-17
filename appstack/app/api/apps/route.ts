import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import App from '@/models/App';

export async function GET() {
    try {
        await connectDB();
        const apps = await App.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: apps });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const app = await App.create(body);
        return NextResponse.json({ success: true, data: app }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating app:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
