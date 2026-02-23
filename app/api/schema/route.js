import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SCHEMA_PATH = path.join(process.cwd(), 'app/data/profileSchema.json');

export async function GET() {
  try {
    const data = await fs.readFile(SCHEMA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read schema' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const schema = await request.json();
    await fs.writeFile(SCHEMA_PATH, JSON.stringify(schema, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save schema' }, { status: 500 });
  }
}