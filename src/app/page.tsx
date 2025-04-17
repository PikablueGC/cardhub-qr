'use client';

import { useState } from 'react';
import Image from 'next/image';

interface QRCode {
  url: string;
  dataUrl: string;
}

export default function Home() {
  const [urls, setUrls] = useState<string>('');
  const [size, setSize] = useState<number>(200);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const generateQRCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const urlList = urls.split('\n').filter(url => url.trim() !== '');
    
    try {
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList, size }),
      });
      
      const data = await response.json();
      setQrCodes(data.qrCodes);
    } catch (error) {
      console.error('Error generating QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 min-h-screen py-12">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">QR Code Generator</h1>
        
        <form onSubmit={generateQRCodes} className="mb-8">
          <div className="mb-4">
            <label htmlFor="urls" className="block mb-2 font-medium">
              Enter URLs (one per line):
              <textarea
                id="urls"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                rows={5}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </label>
          </div>
          
          <div className="mb-6">
            <label htmlFor="size" className="block mb-2 font-medium">
              Size (pixels):
              <input
                type="number"
                id="size"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                min={10}
                max={1000}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                required
              />
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate QR Codes'}
          </button>
        </form>

        {qrCodes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Generated QR Codes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {qrCodes.map((qr, index) => (
                <div key={index} className="border rounded-md p-4 flex flex-col items-center text-center">
                  <p className="mb-2 break-all text-sm">{qr.url}</p>
                  {/* Use a regular img tag instead of Next.js Image for data URLs */}
                  <img src={qr.dataUrl} alt={`QR code for ${qr.url}`} className="mb-2" />
                  <a 
                    href={qr.dataUrl} 
                    download={`qrcode-${index}.png`}
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}