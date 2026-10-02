import { NextRequest, NextResponse } from 'next/server';
import { analyzeURL } from '@/lib/ai/url-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required and must be a string' }, { status: 400 });
    }

    const result = analyzeURL(url);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to analyze URL' }, { status: 500 });
  }
}
