// src/app/print/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// Simple data type for print jobs
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

export default function PrintPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [data, setData] = useState<PrintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPrintData() {
      try {
        const response = await fetch(`/api/get-print-job?id=${id}`);
        if (!response.ok) {
          throw new Error('Print job not found or expired');
        }
        const printData = await response.json();
        setData(printData);
      } catch (err) {
        setError((err instanceof Error) ? err.message : 'Failed to load print data');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchPrintData();
    }
  }, [id]);

  useEffect(() => {
    // Auto-print when data is loaded
    if (data && !loading && !error) {
      // Give the browser a moment to render before printing
      const timer = setTimeout(() => {
        window.print();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [data, loading, error]);

  // Helper functions for label dimensions
  function getLabelWidth(labelSize: string): string {
    const sizes: Record<string, string> = {
      small: '2in',
      medium: '2.25in',
      large: '3in',
      dymo5xl: '1.5in'
    };
    return sizes[labelSize] || '2in';
  }

  function getLabelHeight(labelSize: string): string {
    const sizes: Record<string, string> = {
      small: '1in',
      medium: '1.25in',
      large: '2in',
      dymo5xl: '1.5in'
    };
    return sizes[labelSize] || '1in';
  }

  function getLabelFontSize(labelSize: string): string {
    const sizes: Record<string, string> = {
      small: '10px',
      medium: '12px',
      large: '14px',
      dymo5xl: '10px'
    };
    return sizes[labelSize] || '10px';
  }

  function getLabelTitleSize(labelSize: string): string {
    const sizes: Record<string, string> = {
      small: '11px',
      medium: '13px',
      large: '16px',
      dymo5xl: '12px'
    };
    return sizes[labelSize] || '11px';
  }

  function getLabelPriceSize(labelSize: string): string {
    const sizes: Record<string, string> = {
      small: '16px',
      medium: '20px',
      large: '24px',
      dymo5xl: '20px'
    };
    return sizes[labelSize] || '16px';
  }

  function getQRSize(labelSize: string): number {
    const sizes: Record<string, number> = {
      small: 70,
      medium: 80,
      large: 100,
      dymo5xl: 60
    };
    return sizes[labelSize] || 70;
  }

  function getGridColumns(labelSize: string): number {
    if (labelSize === 'dymo5xl') return 4;
    if (labelSize === 'large') return 2;
    return 3; // Default for small and medium
  }

  if (loading) {
    return <div className="p-8 text-center">Loading your labels...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-center">No print data found</div>;
  }

  const { labels, labelSize, showPrice, showCondition } = data;
  const gridColumns = getGridColumns(labelSize);

  return (
    <div className="p-5">
      {/* Print controls - hidden when printing */}
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
      
      {/* Label container - grid for labels */}
      <div 
        className="grid print:gap-0" 
        style={{ 
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gap: labelSize === 'dymo5xl' ? '0' : '5px'
        }}
      >
        {labels.map((label, index) => (
          <div 
            key={index} 
            style={{
              border: '1px solid #ccc',
              padding: '8px',
              height: getLabelHeight(labelSize),
              width: getLabelWidth(labelSize),
              margin: labelSize === 'dymo5xl' ? '0' : '2px',
              pageBreakInside: 'avoid',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              background: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div 
                style={{
                  fontWeight: 'bold',
                  fontSize: getLabelTitleSize(labelSize),
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: '2px'
                }}
              >
                {label.title}
              </div>
              
              {label.variation && (
                <div 
                  style={{
                    fontStyle: 'italic',
                    fontSize: getLabelFontSize(labelSize),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '2px'
                  }}
                >
                  {label.variation}
                </div>
              )}
              
              {showCondition && label.condition && (
                <div 
                  style={{
                    fontSize: `calc(${getLabelFontSize(labelSize)} - 1px)`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '2px'
                  }}
                >
                  {label.condition}
                </div>
              )}
            </div>
            
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: getLabelFontSize(labelSize),
                margin: '4px 0'
              }}
            >
              <div>ID: {label.identifier}</div>
              {showPrice && (
                <div 
                  style={{
                    fontWeight: 'bold',
                    fontSize: getLabelPriceSize(labelSize),
                    color: '#333'
                  }}
                >
                  {label.price}
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'center', margin: '4px auto' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`/api/qr?url=${encodeURIComponent(label.identifier)}&size=${getQRSize(labelSize)}`}
                alt={`QR code for ${label.identifier}`}
                style={{ 
                  width: `${getQRSize(labelSize)}px`, 
                  height: `${getQRSize(labelSize)}px`,
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Add print-specific styles */}
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