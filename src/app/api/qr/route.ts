import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const sizeParam = searchParams.get('size') || '200';
  
  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }
  
  // Validate size
  const size = parseInt(sizeParam);
  if (isNaN(size) || size < 100 || size > 1000) {
    return NextResponse.json(
      { error: 'Size must be between 100 and 1000 pixels' },
      { status: 400 }
    );
  }

  try {
    // Generate QR code as a Buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      width: size,
      margin: 1,
    });
    
    // Return the QR code image
    return new NextResponse(qrBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, size = 200 } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate size
    const qrSize = parseInt(size.toString());
    if (isNaN(qrSize) || qrSize < 100 || qrSize > 1000) {
      return NextResponse.json(
        { error: 'Size must be between 100 and 1000 pixels' },
        { status: 400 }
      );
    }

    // Generate QR code as a Buffer
    const qrBuffer = await QRCode.toBuffer(url, {
      width: qrSize,
      margin: 1,
    });
    
    // Return the QR code image
    return new NextResponse(qrBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}