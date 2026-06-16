import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

// Simulated AI Categorization
async function categorizeFeedback(feedbackTexts: string[]) {
  // In a real MVP, this calls OpenAI API:
  // const response = await openai.chat.completions.create({ ... })
  
  // Simulated delay
  await new Promise(r => setTimeout(r, 1000));
  
  const insights = [
    { category: 'Bugs', summary: 'Users are experiencing frequent crashes on the login screen.', count: 0 },
    { category: 'Feature Requests', summary: 'High demand for a dark mode and better export options.', count: 0 },
    { category: 'Praise', summary: 'Users love the new dashboard UI and speed.', count: 0 }
  ];

  for (const text of feedbackTexts) {
    const lower = text.toLowerCase();
    if (lower.includes('crash') || lower.includes('bug') || lower.includes('error')) {
      insights[0].count++;
    } else if (lower.includes('want') || lower.includes('add') || lower.includes('feature')) {
      insights[1].count++;
    } else {
      insights[2].count++;
    }
  }

  // Filter out zero counts
  return insights.filter(i => i.count > 0);
}

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, feedback } = await req.json(); // feedback is an array of strings
    if (!title || !feedback || !Array.isArray(feedback)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Insert analysis record
    const result = db.prepare('INSERT INTO analyses (user_id, title, status) VALUES (?, ?, ?)').run(session.userId, title, 'processing');
    const analysisId = result.lastInsertRowid;

    // Process with "AI"
    const insights = await categorizeFeedback(feedback);

    // Save insights
    const insertInsight = db.prepare('INSERT INTO insights (analysis_id, category, summary, count) VALUES (?, ?, ?, ?)');
    const insertMany = db.transaction((insights: any[]) => {
      for (const insight of insights) {
        insertInsight.run(analysisId, insight.category, insight.summary, insight.count);
      }
    });
    insertMany(insights);

    // Update status
    db.prepare('UPDATE analyses SET status = ? WHERE id = ?').run('completed', analysisId);
    
    // Log analytics
    db.prepare('INSERT INTO analytics_events (event_name, user_id) VALUES (?, ?)').run('analysis_created', session.userId);

    return NextResponse.json({ success: true, analysisId });
  } catch (error) {
    console.error('Analysis error', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const analyses = db.prepare('SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC').all(session.userId);
    return NextResponse.json({ analyses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
  }
}
