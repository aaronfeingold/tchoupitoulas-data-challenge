#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('Tchoupitoulas Data Challenge - Development Setup\n');

// Check if .env.local already exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  console.log('WARNING: .env.local already exists!');
  console.log('   Remove it first if you want to regenerate, or edit it manually.\n');
  process.exit(0);
}

// Copy env.example to .env.local
const examplePath = path.join(__dirname, '..', 'env.example');
if (!fs.existsSync(examplePath)) {
  console.error('ERROR: env.example not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(examplePath, 'utf8');
const secret = crypto.randomBytes(32).toString('base64');

// Replace placeholder with generated secret
const updatedContent = envContent.replace(
  'NEXTAUTH_SECRET=your-secret-key-here',
  `NEXTAUTH_SECRET=${secret}`
);

fs.writeFileSync(envPath, updatedContent);

console.log('SUCCESS: Created .env.local with generated NEXTAUTH_SECRET');
console.log('\nNext steps:');
console.log('1. Update the OAuth provider credentials in .env.local');
console.log('2. Set up your database (run: pnpm run db:push)');
console.log('3. Configure OAuth apps (see README.md for detailed guide)');
console.log('\nQuick start for development:');
console.log('   pnpm run dev          - Normal development');
console.log('   pnpm run dev:tunnel   - Development with ngrok support');
console.log('\nSee README.md for complete OAuth setup instructions');