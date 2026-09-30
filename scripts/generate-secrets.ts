#!/usr/bin/env tsx
/**
 * Secret Generation Script for Production Deployment
 * Generates secure random secrets for environment variables
 */

import { randomBytes, createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

function generateSecret(length: number = 32): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

function generateStrongPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const all = uppercase + lowercase + numbers + special;
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest with random characters
  for (let i = password.length; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function generateApiKey(): string {
  return `sk-${generateSecret(32)}`;
}

function generateDatabaseUrlTemplate(): string {
  return 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require&connection_limit=10&pool_timeout=20';
}

function main() {
  console.log('🔐 Generating Production Secrets\n');
  console.log('===================================\n');

  const secrets = {
    NEXTAUTH_SECRET: generateSecret(32),
    CRON_SECRET: generateSecret(32),
    DATABASE_URL_TEMPLATE: generateDatabaseUrlTemplate(),
    STRONG_PASSWORD: generateStrongPassword(),
    API_KEY_TEMPLATE: generateApiKey(),
    ADMIN_PASSWORD: generateStrongPassword()
  };

  console.log('Generated Secrets:\n');
  console.log(`NEXTAUTH_SECRET: ${secrets.NEXTAUTH_SECRET}`);
  console.log(`CRON_SECRET: ${secrets.CRON_SECRET}`);
  console.log(`DATABASE_URL Template: ${secrets.DATABASE_URL_TEMPLATE}`);
  console.log(`Strong Password Example: ${secrets.STRONG_PASSWORD}`);
  console.log(`API Key Template: ${secrets.API_KEY_TEMPLATE}`);
  console.log(`Admin Password (for seeding): ${secrets.ADMIN_PASSWORD}\n`);

  // Save to file (not in git)
  const outputDir = resolve(process.cwd(), '.secrets');
  const outputFile = resolve(outputDir, 'production-secrets.txt');
  
  try {
    writeFileSync(outputFile, `
# PRODUCTION SECRETS - GENERATED ${new Date().toISOString()}
# IMPORTANT: Store these securely and never commit to version control

NEXTAUTH_SECRET=${secrets.NEXTAUTH_SECRET}
CRON_SECRET=${secrets.CRON_SECRET}

# Database URL Template (fill in your actual values)
DATABASE_URL=${secrets.DATABASE_URL_TEMPLATE}

# Example Strong Password for Admin User
ADMIN_PASSWORD=${secrets.ADMIN_PASSWORD}

# API Key Template (for reference)
API_KEY_TEMPLATE=${secrets.API_KEY_TEMPLATE}

# Instructions:
# 1. Replace USER, PASSWORD, HOST, PORT, DATABASE in DATABASE_URL
# 2. Add these to your Vercel Environment Variables
# 3. Use ADMIN_PASSWORD when seeding the database
# 4. Delete this file after adding secrets to Vercel
`);
    
    console.log(`✅ Secrets saved to: ${outputFile}`);
    console.log('⚠️  IMPORTANT: Add these to Vercel Environment Variables, then delete this file.\n');
  } catch (error) {
    console.log('Could not save to file (directory may not exist). Displaying secrets above.\n');
  }

  console.log('===================================');
  console.log('📋 Next Steps:\n');
  console.log('1. Copy the secrets above');
  console.log('2. Go to https://vercel.com/rranjandev3118-boop/settings/environment-variables');
  console.log('3. Add each secret as an environment variable');
  console.log('4. Replace DATABASE_URL template with your actual database connection string');
  console.log('5. Add your ANTHROPIC_API_KEY');
  console.log('6. Deploy with: vercel --prod\n');
}

main();