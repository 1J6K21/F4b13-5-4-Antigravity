import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);

    setSession(result.lastInsertRowid as number);

    db.prepare('INSERT INTO analytics_events (event_name, user_id) VALUES (?, ?)').run('user_registered', result.lastInsertRowid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
