// src/app/api/print-labels/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Label, PrintJob } from '@/types/print';

// Simple in-memory store for print jobs
// In production, use a database or Redis
const printJobsStore: Record<string, PrintJob> = {};

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

    // Store data in memory
    printJobsStore[printId] = {
      labels,
      labelSize,
      showPrice: showPrice ?? true,
      showCondition: showCondition ?? true,
      expires: Date.now() + (1000 * 60 * 30) // Expire after 30 minutes
    };

    // Clean up expired jobs
    Object.keys(printJobsStore).forEach(key => {
      if (printJobsStore[key].expires < Date.now()) {
        delete printJobsStore[key];
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