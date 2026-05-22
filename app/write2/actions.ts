'use server';

import { revalidatePath } from 'next/cache';
import { connectDB, DB_NAME } from '@/util/database';

export async function saveMyName(formData: FormData) {
  const mynameis = formData.get('mynameis');
  if (typeof mynameis !== 'string' || !mynameis.trim()) return;

  const db = (await connectDB).db(DB_NAME);
  await db.collection('post_test').insertOne({ mynameis: mynameis.trim() });
  revalidatePath('/write2');
}
