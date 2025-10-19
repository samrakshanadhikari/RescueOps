#!/usr/bin/env node
/**
 * Quick test to verify Google Maps API key is loaded
 */

require('dotenv').config();

console.log('\n🔍 Testing Google Maps Setup...\n');

// Check if .env file exists
const fs = require('fs');
const envPath = './.env';

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Create it with:');
  console.log('   cp .env.example .env');
  console.log('   # Then add your GOOGLE_MAPS_API_KEY\n');
  process.exit(1);
}

console.log('✅ .env file exists');

// Check if API key is loaded
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.log('❌ GOOGLE_MAPS_API_KEY not found in environment');
  console.log('\n📋 Your .env file should have:');
  console.log('   GOOGLE_MAPS_API_KEY=your_actual_key_here');
  console.log('\n⚠️  Make sure:');
  console.log('   - Variable name is GOOGLE_MAPS_API_KEY (not GOOGLE_MAP_API_KEY)');
  console.log('   - No spaces around the = sign');
  console.log('   - No quotes around the key');
  console.log('   - The line is not commented out (#)');
  console.log('\n💡 After fixing, restart the backend:\n');
  console.log('   pkill -f "node backend/server.js"');
  console.log('   node backend/server.js\n');
  process.exit(1);
}

console.log('✅ GOOGLE_MAPS_API_KEY is loaded');
console.log(`   Length: ${apiKey.length} characters`);
console.log(`   Preview: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);

// Check other required env vars
const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'GEMINI_API_KEY'];
console.log('\n📋 Checking other environment variables:');

for (const varName of requiredVars) {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}`);
  } else {
    console.log(`   ⚠️  ${varName} (optional or missing)`);
  }
}

console.log('\n🎉 Setup looks good!');
console.log('\n📝 Next steps:');
console.log('   1. Make sure backend is running: node backend/server.js');
console.log('   2. Login to the app at: http://localhost:3000');
console.log('   3. Submit a non-emergency request');
console.log('   4. Check if the map displays!\n');

