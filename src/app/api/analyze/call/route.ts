import { NextRequest, NextResponse } from 'next/server';
import { analyzeCall } from '@/lib/ai/call-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, transcript } = await req.json();
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const result = analyzeCall(phoneNumber, transcript || '');
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to analyze call' }, { status: 500 });
  }
}
