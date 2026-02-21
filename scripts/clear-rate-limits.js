// Script to clear all rate limit records from the database
// Run this with: node scripts/clear-rate-limits.js

import mongoose from 'mongoose';
import RateLimit from '../models/RateLimit.js';

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';

async function clearRateLimits() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log('🗑️  Deleting all rate limit records...');
    const result = await RateLimit.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} rate limit records`);
    console.log('🎉 Rate limits cleared! You can now test with a fresh slate.');
    
    await mongoose.connection.close();
    console.log('👋 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearRateLimits();
