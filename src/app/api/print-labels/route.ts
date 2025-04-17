// src/app/api/print-labels/route.ts
import { PrintJob } from '@/types/print';
import { NextRequest, NextResponse } from 'next/server';

// Create a simple in-memory store for print jobs
// In production, you should use a proper database
const printJobs: Record<string, PrintJob> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labels, labelSize, showPrice, showCondition } = body as {
      labels: Label[];
      labelSize: string;
      showPrice?: boolean;
      showCondition?: boolean;
    };

    if (!labels || !Array.isArray(labels) || labels.length === 0) {
      return NextResponse.json(
        { error: 'Labels data is required' },
        { status: 400 }
      );
    }

    // Generate a unique ID for this print job
    const printId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Store this data in memory
    printJobs[printId] = {
      labels,
      labelSize,
      showPrice: showPrice ?? true,
      showCondition: showCondition ?? true,
      expires: Date.now() + (1000 * 60 * 30) // Expire after 30 minutes
    };

    // Clean up expired print jobs
    Object.keys(printJobs).forEach(key => {
      if (printJobs[key].expires < Date.now()) {
        delete printJobs[key];
      }
    });

    // Return the URL to the print page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cardhub-qr.vercel.app';
    return NextResponse.json({
      success: true,
      printUrl: `${baseUrl}/print/${printId}`
    });
  } catch (error) {
    console.error('Error processing print request:', error);
    return NextResponse.json(
      { error: 'Failed to process print request' },
      { status: 500 }
    );
  }
}