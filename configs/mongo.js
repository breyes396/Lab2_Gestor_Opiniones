import mongoose from 'mongoose';
import { config } from './config.js';

export const mongoConnection = async () => {
  try {
    await mongoose.connect(config.mongo.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB | Connected successfully');
  } catch (error) {
    console.error('MongoDB | Connection error:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB | Connection closed due to app termination');
  } catch (error) {
    console.error('MongoDB | Error during shutdown:', error.message);
  }
});
