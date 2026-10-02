import { NextRequest, NextResponse } from 'next/server';
import { analyzeEmail } from '@/lib/ai/email-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { sender, subject, body } = await req.json();
    if (!sender && !body) {
      return NextResponse.json({ error: 'Sender email or email body is required' }, { status: 400 });
    }

    const result = analyzeEmail(sender || '', subject || '', body || '');
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to analyze email' }, { status: 500 });
  }
}
