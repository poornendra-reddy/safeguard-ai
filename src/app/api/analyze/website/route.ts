import { NextRequest, NextResponse } from 'next/server';
import { analyzeURL } from '@/lib/ai/url-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
    }

    const result = analyzeURL(url);
    result.type = 'website';
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to analyze website' }, { status: 500 });
  }
}
