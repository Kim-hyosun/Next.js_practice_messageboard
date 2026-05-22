import { MongoClient } from 'mongodb';

const url = process.env.MONGOKEY;
if (!url) {
  throw new Error(
    'MONGOKEY 환경변수가 설정되지 않았습니다. .env.local을 확인해주세요.'
  );
}

declare global {
  // eslint-disable-next-line no-var
  var _mongo: Promise<MongoClient> | undefined;
}

let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // dev: HMR로 인한 다중 connection 방지 위해 global에 캐싱
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}

export { connectDB };
export const DB_NAME = 'forum_next';
