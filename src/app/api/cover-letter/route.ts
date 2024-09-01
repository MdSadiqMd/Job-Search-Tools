import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    try {
        console.log("Function called");

        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdf(buffer);

        return NextResponse.json({ text: data.text }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error parsing PDF', error: error.message }, { status: 500 });
    }
}