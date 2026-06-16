import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analysis = db.prepare('SELECT * FROM analyses WHERE id = ? AND user_id = ?').get(params.id, session.userId);
    if (!analysis) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const insights = db.prepare('SELECT * FROM insights WHERE analysis_id = ?').all(params.id);

    // Log analytics
    db.prepare('INSERT INTO analytics_events (event_name, user_id) VALUES (?, ?)').run('analysis_viewed', session.userId);

    return NextResponse.json({ analysis, insights });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}
