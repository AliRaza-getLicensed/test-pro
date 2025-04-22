// import { NextRequest, NextResponse } from 'next/server';
// import { writeFile } from 'fs/promises';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// // Define the directory for temporary storage
// const UPLOAD_DIR = path.join(process.cwd(), 'public', 'temp-uploads');

// export async function POST(request: NextRequest) {
//   try {
//     // Get the form data from the request
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
    
//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // Generate a unique filename
//     const fileName = `${uuidv4()}-${file.name}`;
//     const filePath = path.join(UPLOAD_DIR, fileName);
    
//     // Convert file to buffer
//     const buffer = Buffer.from(await file.arrayBuffer());
    
//     // Write file to disk
//     await writeFile(filePath, buffer);
    
//     // Return the public URL for the file
//     // This will be accessible through the public directory
//     const publicUrl = `/temp-uploads/${fileName}`;
    
//     return NextResponse.json({ 
//       success: true, 
//       fileUrl: publicUrl,
//       fileName: file.name,
//       expiresIn: '1 hour' // We'll implement cleanup later
//     });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
//   }
// }

// app/api/upload/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { writeFile, mkdir } from 'fs/promises';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// // Define the directory for temporary storage
// const UPLOAD_DIR = path.join(process.cwd(), 'public', 'temp-uploads');

// // Ensure the upload directory exists
// async function ensureUploadDir() {
//   try {
//     await mkdir(UPLOAD_DIR, { recursive: true });
//   } catch (error) {
//     console.error('Error creating upload directory:', error);
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     // Ensure upload directory exists
//     await ensureUploadDir();

//     // Get the form data from the request
//     const formData = await request.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     // Generate a unique filename
//     const fileName = `${uuidv4()}-${file.name}`;
//     const filePath = path.join(UPLOAD_DIR, fileName);

//     // Convert file to buffer
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // Write file to disk
//     await writeFile(filePath, buffer);

//     // Get the base URL (localhost:3000 for dev, or your production domain)
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
//     const publicUrl = `${baseUrl}/temp-uploads/${fileName}`;

//     // Set CORS headers for the response
//     const response = NextResponse.json({
//       success: true,
//       fileUrl: publicUrl,
//       fileName: file.name,
//       expiresIn: '1 hour',
//     });

//     response.headers.set('Access-Control-Allow-Origin', '*');
//     response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD');
//     response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

//     return response;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
//   }
// }

// // Handle CORS for file access
// export async function OPTIONS() {
//   const response = NextResponse.json({});
//   response.headers.set('Access-Control-Allow-Origin', '*');
//   response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST');
//   response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
//   return response;
// }

// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the directory for temporary storage
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'temp-uploads');

// Ensure the upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure upload directory exists
    await ensureUploadDir();

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = path.extname(file.name).toLowerCase();
    if (fileExtension !== '.pptx' && fileExtension !== '.ppt') {
      return NextResponse.json({ error: 'Only .pptx or .ppt files are supported' }, { status: 400 });
    }
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write file to disk
    await writeFile(filePath, buffer);

    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const publicUrl = `${baseUrl}/temp-uploads/${fileName}`;

    // Set CORS headers for the response
    const response = NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      fileName: file.name,
      expiresIn: '1 hour',
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  const response = NextResponse.json({});
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}