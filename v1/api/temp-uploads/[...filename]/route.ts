// app/api/temp-uploads/[...filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'temp-uploads');

export async function GET(request: NextRequest, { params }: { params: { filename: string[] } }) {
  try {
    const fileName = params.filename.join('/');
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Check if file exists
    await fs.access(filePath);

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Set response headers
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Content-Disposition', 'inline'); // Ensure inline rendering

    return response;
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'File not found or inaccessible' }, { status: 404 });
  }
}

export async function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}