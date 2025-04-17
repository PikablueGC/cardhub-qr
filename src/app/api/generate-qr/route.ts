// This API route generates QR codes for a list of URLs.
// It accepts a POST request with a JSON body containing an array of URLs and an optional size parameter.
// The response will be a JSON object containing the generated QR codes as data URLs.
// The QR codes are generated using the 'qrcode' library.

import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

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

    const qrCodes = await Promise.all(
      urls.map(async (url: string) => {
        const dataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 1,
        });
        
        return { url, dataUrl };
      })
    );

    return NextResponse.json({ qrCodes });
  } catch (error) {
    console.error('Error generating QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR codes' },
      { status: 500 }
    );
  }
}
