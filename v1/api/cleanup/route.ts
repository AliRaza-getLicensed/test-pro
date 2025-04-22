import { NextRequest, NextResponse } from 'next/server';
import { readdir, unlink, stat } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'temp-uploads');
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const files = await readdir(UPLOAD_DIR);
    const now = Date.now();
    let deletedCount = 0;
    
    for (const file of files) {
      if (file === '.gitkeep') continue; // Skip .gitkeep file
      
      const filePath = path.join(UPLOAD_DIR, file);
      const fileStat = await stat(filePath);
      
      // Delete files older than MAX_AGE_MS
      if (now - fileStat.mtime.getTime() > MAX_AGE_MS) {
        await unlink(filePath);
        deletedCount++;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Deleted ${deletedCount} expired files`
    });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}