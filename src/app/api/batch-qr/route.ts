import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, size = 200 } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs are required and must be an array' },
        { status: 400 }
      );
    }

    if (urls.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 QR codes per request' },
        { status: 400 }
      );
    }

    // Create a new ZIP file
    const zip = new JSZip();
    
    // Generate QR code for each URL and add to ZIP
    await Promise.all(
      urls.map(async (url: string, index: number) => {
        // Generate QR code as a Buffer
        const qrBuffer = await QRCode.toBuffer(url, {
          width: size,
          margin: 1,
        });
        
        // Add to ZIP file with a name
        const fileName = `qrcode-${index + 1}.png`;
        zip.file(fileName, qrBuffer);
        
        return { url, fileName };
      })
    );
    
    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=qrcodes.zip'
      }
    });
  } catch (error) {
    console.error('Error generating QR codes ZIP:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR codes ZIP' },
      { status: 500 }
    );
  }
}