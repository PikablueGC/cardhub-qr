// src/app/print-direct/page.tsx with improved print layout
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type PrintData = {
  labels: Array<{
    title: string;
    variation?: string;
    condition?: string;
    identifier: string;
    price: string;
  }>;
  labelSize: string;
  showPrice: boolean;
  showCondition: boolean;
}

export default function PrintDirectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PrintContent />
    </Suspense>
  );
}

function PrintContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PrintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');
      if (!dataParam) throw new Error('No print data provided');
      setData(JSON.parse(decodeURIComponent(dataParam)));
    } catch (err) {
      setError((err instanceof Error) ? err.message : 'Failed to parse data');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) return <div className="p-8 text-center">Loading your labels...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-8 text-center">No print data found</div>;

  const { labels, labelSize, showPrice, showCondition } = data;

  // Label size configurations with exact dimensions
  const dimensions = {
    small: { width: '2in', height: '1in', titleSize: '11px', textSize: '9px', priceSize: '14px', qrSize: 90 },
    medium: { width: '2.25in', height: '1.25in', titleSize: '13px', textSize: '11px', priceSize: '18px', qrSize: 110 },
    large: { width: '3in', height: '1.8in', titleSize: '16px', textSize: '13px', priceSize: '22px', qrSize: 150 },
    dymo5xl: { width: '1.5in', height: '1.5in', titleSize: '12px', textSize: '10px', priceSize: '16px', qrSize: 90 }
  }[labelSize] || { width: '2.25in', height: '1.25in', titleSize: '13px', textSize: '11px', priceSize: '18px', qrSize: 110 };

  return (
    <div className="p-4 print:p-0">
      <div className="print:hidden bg-gray-100 p-4 mb-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Ready to Print: {labels.length} Labels</h1>
        <p className="mb-4">Click the button below to print, or use Ctrl+P (Cmd+P on Mac)</p>
        <button onClick={() => window.print()} className="bg-green-700 text-white px-4 py-2 rounded">
          Print These Labels
        </button>
      </div>
      
      <div className="screen-container">
        {labels.map((label, index) => (
          <div key={index} className="label-item" style={{
            width: dimensions.width,
            height: dimensions.height,
            border: '1px solid #ddd',
            padding: '2px',
            margin: '2px',
            display: 'inline-block',
            verticalAlign: 'top',
            backgroundColor: 'white',
          }}>
            <div style={{ height: '30%', overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: dimensions.titleSize, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label.title}
              </div>
              {label.variation && (
                <div style={{ fontStyle: 'italic', fontSize: dimensions.textSize, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {label.variation}
                </div>
              )}
              {showCondition && label.condition && (
                <div style={{ fontSize: dimensions.textSize, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {label.condition}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: dimensions.textSize, height: '18%' }}>
              <div>ID: {label.identifier}</div>
              {showPrice && (
                <div style={{ fontWeight: 'bold', fontSize: dimensions.priceSize }}>
                  {label.price}
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'center', height: '55%' }}>
              <img 
                src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=${dimensions.qrSize}&errorCorrectionLevel=L`}
                alt="QR Code"
                style={{ maxHeight: '100%', maxWidth: '80%', display: 'inline-block' }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @media print {
          @page { margin: 0; }
          html, body { 
            margin-top: 2px;
      margin-left: 7px;
      margin-right: 0;
      margin-bottom: 0;
            padding: 0;
          }
          .screen-container {
            display: block;
            page-break-inside: auto;
          }
          .label-item {
            page-break-inside: avoid;
            box-sizing: border-box;
            float: left;
            margin: 0 !important;
            padding: 2px !important;
          }
        }
      `}</style>
    </div>
  );
}