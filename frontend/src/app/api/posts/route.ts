import { NextResponse } from 'next/server';
import { fetchPosts } from '@/lib/nocodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await fetchPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('API /posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
