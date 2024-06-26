// db.js

import { MongoClient } from 'mongodb';

const url = process.env.MONGOKEY;
let connectDB;

if (process.env.NODE_ENV === 'development') {
  //development mode
  if (!global._mongo) {
    try {
      global._mongo = new MongoClient(url).connect();
    } catch (error) {
      console.error('Error connecting to MongoDB in development mode:', error);
      process.exit(1); // 프로세스 종료
    }
  }
  connectDB = global._mongo;
} else {
  //product mode
  try {
    connectDB = new MongoClient(url).connect();
  } catch (error) {
    console.error('Error connecting to MongoDB in production mode:', error);
    process.exit(1); // 프로세스 종료
  }
}

export { connectDB };
