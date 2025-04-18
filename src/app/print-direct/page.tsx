// Updated print-direct/page.tsx with optimized grids and label layouts
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

  useEffect(() => {
    if (data && !loading && !error) {
      setTimeout(() => window.print(), 1000);
    }
  }, [data, loading, error]);

  // Grid configurations for different label sizes
  function getGridConfig(labelSize: string) {
    switch(labelSize) {
      case 'small': return { cols: 3, rows: 10, gap: '0.05in' };
      case 'medium': return { cols: 3, rows: 8, gap: '0.05in' };
      case 'large': return { cols: 2, rows: 5, gap: '0.1in' };
      case 'dymo5xl': return { cols: 4, rows: 4, gap: '0' };
      default: return { cols: 3, rows: 8, gap: '0.05in' };
    }
  }

  function renderLabel(label: PrintData['labels'][0], index: number, labelSize: string) {
    const dimensions = {
      small: { width: '2in', height: '1in', qrSize: 110, fontSize: { title: 11, text: 9, price: 14 } },
      medium: { width: '2.25in', height: '1.25in', qrSize: 130, fontSize: { title: 13, text: 11, price: 16 } },
      large: { width: '3in', height: '2in', qrSize: 160, fontSize: { title: 16, text: 13, price: 22 } },
      dymo5xl: { width: '1.5in', height: '1.5in', qrSize: 120, fontSize: { title: 12, text: 10, price: 16 } }
    }[labelSize] || { width: '2.25in', height: '1.25in', qrSize: 130, fontSize: { title: 13, text: 11, price: 16 } };

    return (
      <div key={index} style={{
        width: dimensions.width,
        height: dimensions.height,
        padding: '0.08in',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        textAlign: 'center',
        pageBreakInside: 'avoid',
      }}>
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: `${dimensions.fontSize.title}px`, 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {label.title}
          </div>
          
          {label.variation && (
            <div style={{ 
              fontStyle: 'italic', 
              fontSize: `${dimensions.fontSize.text}px`, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {label.variation}
            </div>
          )}
          
          {data?.showCondition && label.condition && (
            <div style={{ 
              fontSize: `${dimensions.fontSize.text}px`, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {label.condition}
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontSize: `${dimensions.fontSize.text}px`, 
          margin: '0.05in 0' 
        }}>
          <div>ID: {label.identifier}</div>
          {data?.showPrice && (
            <div style={{ fontWeight: 'bold', fontSize: `${dimensions.fontSize.price}px`, color: '#333' }}>
              {label.price}
            </div>
          )}
        </div>
        
        <div style={{ 
          flex: '1', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          margin: '0.03in 0'
        }}>
          <img 
            src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=${dimensions.qrSize}&errorCorrectionLevel=L`}
            alt="QR Code"
            style={{ maxHeight: '95%', maxWidth: '95%', height: 'auto', width: 'auto' }}
          />
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Loading your labels...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-8 text-center">No print data found</div>;

  const { labels, labelSize } = data;
  const gridConfig = getGridConfig(labelSize);

  return (
    <div className="p-2">
      <div className="print:hidden bg-gray-100 p-4 mb-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Ready to Print: {labels.length} Labels</h1>
        <p className="mb-4">Click the button below to print, or use Ctrl+P (Cmd+P on Mac)</p>
        <button 
          onClick={() => window.print()}
          className="bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-800"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M5 4.5C5 3.67 5.67 3 6.5 3h7c.83 0 1.5.67 1.5 1.5v1h.5A2.5 2.5 0 0118 8v5a2.5 2.5 0 01-2.5 2.5h-.5v1c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-1H4.5A2.5 2.5 0 012 13V8a2.5 2.5 0 012.5-2.5H5v-1zm1.5 0v1h7v-1h-7z"/>
          </svg>
          Print These Labels
        </button>
      </div>
      
      <div 
        className="grid print:gap-0"
        style={{ 
          gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
          gap: gridConfig.gap
        }}
      >
        {labels.map((label, index) => renderLabel(label, index, labelSize))}
      </div>
      
      <style jsx global>{`
        @media print {
          @page { margin: 0.25cm; }
          body { margin: 0; padding: 0; }
          .print\\:gap-0 { gap: 0 !important; }
        }
      `}</style>
    </div>
  );
}