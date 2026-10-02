import { NextRequest, NextResponse } from 'next/server';
import { analyzeMessage } from '@/lib/ai/message-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const result = analyzeMessage(message);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to analyze message' }, { status: 500 });
  }
}
