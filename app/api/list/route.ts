import { NextResponse } from 'next/server';
import { connectDB, DB_NAME } from '@/util/database';
import { internalErrorResponse } from '@/util/api-response';

export async function GET() {
  try {
    const db = (await connectDB).db(DB_NAME);
    const result = await db.collection('post').find().toArray();
    return NextResponse.json(
      result.map((p) => ({ ...p, _id: p._id.toString() }))
    );
  } catch (err) {
    return internalErrorResponse(err);
  }
}
