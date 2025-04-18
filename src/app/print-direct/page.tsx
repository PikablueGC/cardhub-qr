// src/app/print-direct/page.tsx
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
    <Suspense fallback={<div className="p-8 text-center">Loading your labels...</div>}>
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
      if (!dataParam) {
        throw new Error('No print data provided');
      }
      const parsedData = JSON.parse(decodeURIComponent(dataParam)) as PrintData;
      setData(parsedData);
    } catch (err) {
      setError((err instanceof Error) ? err.message : 'Failed to parse print data');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (data && !loading && !error) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data, loading, error]);

  // Rendering functions for different label sizes
  function renderSmallLabel(label: PrintData['labels'][0], index: number) {
    return (
      <div key={index} style={{
        width: '2in',
        height: '1in',
        padding: '3px',
        margin: '2px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'white',
        textAlign: 'center',
      }}>
        <div style={{ height: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label.title}
          </div>
          {label.variation && (
            <div style={{ fontStyle: 'italic', fontSize: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label.variation}
            </div>
          )}
          {data?.showCondition && label.condition && (
            <div style={{ fontSize: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label.condition}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px' }}>
          <div>ID: {label.identifier}</div>
          {data?.showPrice && (
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              {label.price}
            </div>
          )}
        </div>
        
        <div style={{ height: '45%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=120`}
            alt={`QR for ${label.identifier}`}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
      </div>
    );
  }
  
  function renderMediumLabel(label: PrintData['labels'][0], index: number) {
    return (
      <div key={index} style={{
        width: '2.25in',
        height: '1.25in',
        padding: '4px',
        margin: '2px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'white',
        textAlign: 'center',
      }}>
        <div style={{ height: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label.title}
          </div>
          {label.variation && (
            <div style={{ fontStyle: 'italic', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label.variation}
            </div>
          )}
          {data?.showCondition && label.condition && (
            <div style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label.condition}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <div>ID: {label.identifier}</div>
          {data?.showPrice && (
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
              {label.price}
            </div>
          )}
        </div>
        
        <div style={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=130`}
            alt={`QR for ${label.identifier}`}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
      </div>
    );
  }
  
  function renderLargeLabel(label: PrintData['labels'][0], index: number) {
    return (
      <div key={index} style={{
        width: '3in',
        height: '2in',
        padding: '6px',
        margin: '2px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'white',
        textAlign: 'center',
      }}>
        <div style={{ height: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label.title}
          </div>
          {label.variation && (
            <div style={{ fontStyle: 'italic', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
              {label.variation}
            </div>
          )}
          {data?.showCondition && label.condition && (
            <div style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>
              {label.condition}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', margin: '8px 0' }}>
          <div>ID: {label.identifier}</div>
          {data?.showPrice && (
            <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#333' }}>
              {label.price}
            </div>
          )}
        </div>
        
        <div style={{ height: '55%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=180`}
            alt={`QR for ${label.identifier}`}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
      </div>
    );
  }
  
  function renderDymo5XLLabel(label: PrintData['labels'][0], index: number) {
    return (
      <div key={index} style={{
        width: '1.5in',
        height: '1.5in',
        padding: '4px',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'white',
        textAlign: 'center',
      }}>
        <div style={{ height: '30%' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label.title}
          </div>
          {label.variation && (
            <div style={{ fontStyle: 'italic', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label.variation}
            </div>
          )}
          {data?.showCondition && label.condition && (
            <div style={{ fontSize: '9px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {label.condition}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
          <div>ID: {label.identifier}</div>
          {data?.showPrice && (
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
              {label.price}
            </div>
          )}
        </div>
        
        <div style={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=120`}
            alt={`QR for ${label.identifier}`}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
      </div>
    );
  }

  function getGridColumns(labelSize: string): number {
    if (labelSize === 'dymo5xl') return 4;
    if (labelSize === 'large') return 2;
    return 3; // Default for small and medium
  }

  if (loading) return <div className="p-8 text-center">Loading your labels...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-8 text-center">No print data found</div>;

  const { labels, labelSize } = data;
  const gridColumns = getGridColumns(labelSize);

  // Select renderer based on label size
  const renderLabel = {
    small: renderSmallLabel,
    medium: renderMediumLabel,
    large: renderLargeLabel,
    dymo5xl: renderDymo5XLLabel
  }[labelSize] || renderMediumLabel;

  return (
    <div className="p-5">
      <div className="print:hidden bg-gray-100 p-5 mb-5 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Ready to Print: {labels.length} Labels</h1>
        <p className="mb-4">Click the button below to print, or use Ctrl+P (Cmd+P on Mac)</p>
        <button 
          onClick={() => window.print()}
          className="bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-800"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" className="inline-block">
            <path d="M5 4.5C5 3.67 5.67 3 6.5 3h7c.83 0 1.5.67 1.5 1.5v1h.5A2.5 2.5 0 0118 8v5a2.5 2.5 0 01-2.5 2.5h-.5v1c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-1H4.5A2.5 2.5 0 012 13V8a2.5 2.5 0 012.5-2.5H5v-1zm1.5 0v1h7v-1h-7zm-2 5v3.5c0 .28.22.5.5.5h2V12h7v1.5h2a.5.5 0 00.5-.5V9.5a.5.5 0 00-.5-.5h-11a.5.5 0 00-.5.5zm9.5 2a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5H16a.5.5 0 01-.5-.5v-.5z"/>
          </svg>
          Print These Labels
        </button>
      </div>
      
      <div 
        className="grid print:gap-0" 
        style={{ 
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: labelSize === 'dymo5xl' ? '0' : '5px'
        }}
      >
        {labels.map((label, index) => renderLabel(label, index))}
      </div>
      
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0.25cm;
          }
          body {
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}