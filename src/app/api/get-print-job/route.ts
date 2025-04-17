
// src/app/api/get-print-job/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrintJob } from '@/types/print';

// Access the print jobs store
// For simplicity in this example, we'll declare it here again
// In a real app, use a shared module or database
declare global {
  // eslint-disable-next-line no-var
  var printJobs: Record<string, PrintJob>;
}

// Initialize global printJobs if not exists
if (typeof global.printJobs === 'undefined') {
  global.printJobs = {};
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Print job ID is required' },
      { status: 400 }
    );
  }
  
  // Get the print job data
  const printJob = global.printJobs[id];
  
  if (!printJob) {
    return NextResponse.json(
      { error: 'Print job not found or expired' },
      { status: 404 }
    );
  }
  
  // Check if expired
  if (printJob.expires < Date.now()) {
    delete global.printJobs[id];
    return NextResponse.json(
      { error: 'Print job has expired' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(printJob);
}