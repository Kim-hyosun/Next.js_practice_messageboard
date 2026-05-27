import { MongoClient, type Db } from 'mongodb';

const url = process.env.MONGOKEY;
if (!url) {
  throw new Error(
    'MONGOKEY 환경변수가 설정되지 않았습니다. .env.local을 확인해주세요.'
  );
}

export const DB_NAME = 'forum_next';

declare global {
  // eslint-disable-next-line no-var
  var _mongo: Promise<MongoClient> | undefined;
}

/**
 * 연결 promise를 만들면서 즉시 .catch 핸들러를 붙인다.
 * - unhandledRejection으로 dev 서버 프로세스가 죽는 것을 방지
 * - 연결 실패 시 캐시를 비워 다음 호출에서 재시도 가능하게 함
 */
function createConnection(): Promise<MongoClient> {
  const promise = new MongoClient(url as string).connect();
  promise.catch((err: unknown) => {
    if (process.env.NODE_ENV === 'development') global._mongo = undefined;
    else cached = undefined;
    console.error(
      '[db] MongoDB 연결 실패:',
      err instanceof Error ? err.message : err
    );
  });
  return promise;
}

let cached: Promise<MongoClient> | undefined;

/** 캐시된 MongoClient 연결을 반환 (최초 호출 시 lazy connect). */
export function getClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    // dev: HMR로 인한 다중 connection 방지 위해 global에 캐싱
    if (!global._mongo) global._mongo = createConnection();
    return global._mongo;
  }
  if (!cached) cached = createConnection();
  return cached;
}

/** forum_next DB 핸들을 반환. */
export async function getDb(): Promise<Db> {
  return (await getClient()).db(DB_NAME);
}
