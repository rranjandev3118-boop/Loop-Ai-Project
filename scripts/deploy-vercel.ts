#!/usr/bin/env tsx
/**
 * Automated Vercel Deployment Script
 * Handles complete deployment process including checks, builds, and verification
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const execAsync = promisify(exec);

interface DeploymentStep {
  name: string;
  fn: () => Promise<void>;
  critical: boolean;
}

class DeploymentManager {
  private steps: DeploymentStep[] = [];
  private results: Array<{ step: string; success: boolean; duration: number; error?: string }> = [];

  addStep(name: string, fn: () => Promise<void>, critical: boolean = true) {
    this.steps.push({ name, fn, critical });
  }

  async executeStep(step: DeploymentStep): Promise<void> {
    const startTime = Date.now();
    console.log(`\n🔄 ${step.name}...`);
    
    try {
      await step.fn();
      const duration = Date.now() - startTime;
      this.results.push({ step: step.name, success: true, duration });
      console.log(`✅ ${step.name} completed (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({ step: step.name, success: false, duration, error: errorMessage });
      console.log(`❌ ${step.name} failed (${duration}ms): ${errorMessage}`);
      
      if (step.critical) {
        throw error;
      }
    }
  }

  async deploy(): Promise<void> {
    console.log('🚀 Starting Automated Vercel Deployment\n');
    console.log('======================================\n');

    for (const step of this.steps) {
      await this.executeStep(step);
    }

    this.printSummary();
  }

  private printSummary() {
    console.log('\n======================================');
    console.log('📊 Deployment Summary\n');

    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`✅ Successful: ${successful}/${this.results.length}`);
    console.log(`❌ Failed: ${failed}/${this.results.length}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms\n`);

    if (failed > 0) {
      console.log('Failed steps:');
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.step}: ${r.error}`);
      });
    }
  }
}

async function checkPrerequisites() {
  console.log('Checking deployment prerequisites...');
  
  // Check if .secrets file exists
  const secretsFile = resolve(process.cwd(), '.secrets', 'production-secrets.txt');
  if (!existsSync(secretsFile)) {
    console.log('⚠️  Secrets file not found. Run: npm run secrets:generate');
  } else {
    console.log('✅ Secrets file exists');
  }

  // Check if node_modules exists
  const nodeModules = resolve(process.cwd(), 'node_modules');
  if (!existsSync(nodeModules)) {
    throw new Error('node_modules not found. Run: npm install');
  }
  console.log('✅ Dependencies installed');

  // Check if .next directory exists (build)
  const nextDir = resolve(process.cwd(), '.next');
  if (!existsSync(nextDir)) {
    console.log('⚠️  Build directory not found. Will build during deployment.');
  } else {
    console.log('✅ Build directory exists');
  }
}

async function runTests() {
  console.log('Running comprehensive test suite...');
  const { stdout, stderr } = await execAsync('npm run test:all');
  console.log(stdout);
  if (stderr) console.error(stderr);
}

async function buildProject() {
  console.log('Building project for production...');
  const { stdout, stderr } = await execAsync('npm run build');
  console.log(stdout);
  if (stderr) console.error(stderr);
}

async function deployToVercel() {
  console.log('Deploying to Vercel...');
  
  try {
    // Try to link to existing project first
    await execAsync('vercel link --yes');
    console.log('✅ Linked to Vercel project');
  } catch (error) {
    console.log('⚠️  Could not auto-link. You may need to link manually.');
  }

  // Deploy to production
  const { stdout, stderr } = await execAsync('vercel --prod');
  
  if (stderr) {
    console.error('Deployment stderr:', stderr);
  }
}

async function runDatabaseMigrations() {
  console.log('Running database migrations...');
  
  try {
    await execAsync('npx prisma db push');
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.log('⚠️  Database migrations failed. You may need to run manually.');
    console.log('Run: npx prisma db push');
  }
}

async function seedProductionData() {
  console.log('Seeding production data...');
  
  try {
    await execAsync('npm run seed:production');
    console.log('✅ Production data seeded');
  } catch (error) {
    console.log('⚠️  Seeding failed. You may need to seed manually.');
    console.log('Run: npm run seed:production');
  }
}

async function verifyDeployment() {
  console.log('Verifying deployment...');
  
  try {
    // Check if vercel URL is available
    const { stdout } = await execAsync('vercel ls --json');
    const deployments = JSON.parse(stdout);
    
    if (deployments && deployments.length > 0) {
      const latestDeployment = deployments[0];
      console.log(`✅ Deployment verified: ${latestDeployment.url}`);
      console.log(`🌐 Access your app at: ${latestDeployment.url}`);
    }
  } catch (error) {
    console.log('⚠️  Could not verify deployment URL automatically.');
    console.log('Check your Vercel dashboard for the deployment URL.');
  }
}

async function displaySecrets() {
  console.log('🔐 Production Secrets Reference\n');
  
  const secretsFile = resolve(process.cwd(), '.secrets', 'production-secrets.txt');
  if (existsSync(secretsFile)) {
    const secrets = readFileSync(secretsFile, 'utf-8');
    console.log(secrets);
    console.log('\n⚠️  IMPORTANT: Add these to your Vercel Environment Variables!');
    console.log('Go to: https://vercel.com/rranjandev3118-boop/settings/environment-variables\n');
  } else {
    console.log('Run: npm run secrets:generate\n');
  }
}

async function main() {
  const manager = new DeploymentManager();

  // Add deployment steps
  manager.addStep('Display Secrets', displaySecrets, false);
  manager.addStep('Check Prerequisites', checkPrerequisites, true);
  manager.addStep('Run Tests', runTests, true);
  manager.addStep('Build Project', buildProject, true);
  manager.addStep('Deploy to Vercel', deployToVercel, true);
  manager.addStep('Run Database Migrations', runDatabaseMigrations, false);
  manager.addStep('Seed Production Data', seedProductionData, false);
  manager.addStep('Verify Deployment', verifyDeployment, false);

  try {
    await manager.deploy();
    
    console.log('\n======================================');
    console.log('🎉 Deployment Completed Successfully!\n');
    console.log('Next Steps:');
    console.log('1. Add secrets to Vercel Environment Variables');
    console.log('2. Configure your database connection');
    console.log('3. Test your deployed application');
    console.log('4. Change default admin credentials\n');
    
    process.exit(0);
  } catch (error) {
    console.log('\n======================================');
    console.log('❌ Deployment Failed\n');
    console.log('Please fix the errors above and try again.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Deployment script failed:', error);
  process.exit(1);
});