#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset}  ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset}  ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset}  ${msg}`),
};

function exec(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return null;
  }
  
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && key.trim()) {
      env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
  return env;
}

function updateEnv(key, value) {
  const envPath = path.join(process.cwd(), '.env');
  let content = fs.readFileSync(envPath, 'utf-8');
  
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  if (pattern.test(content)) {
    content = content.replace(pattern, `${key}="${value}"`);
  } else {
    content += `\n${key}="${value}"`;
  }
  
  fs.writeFileSync(envPath, content);
}

function generateSecret() {
  return require('crypto').randomBytes(24).toString('base64');
}

async function setup() {
  console.log('\n' + colors.blue + '========================================' + colors.reset);
  console.log(colors.blue + '  Constraintly - Full Project Setup' + colors.reset);
  console.log(colors.blue + '========================================' + colors.reset + '\n');

  // Step 1: Check/create .env file
  log.info('Step 1: Setting up environment variables');
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log.success('.env file created from .env.example');
      log.warn('Please update DATABASE_URL with your PostgreSQL connection string');
    } else {
      log.error('.env.example not found');
      process.exit(1);
    }
  } else {
    log.success('.env file already exists');
  }

  // Step 2: Load environment
  const env = loadEnv();
  if (!env || !env.DATABASE_URL) {
    log.error('DATABASE_URL not set in .env file');
    process.exit(1);
  }
  log.success('DATABASE_URL is configured');

  // Step 3: Generate BETTER_AUTH_SECRET if needed
  log.info('\nStep 2: Configuring Better Auth');
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.includes('your-secret')) {
    const secret = generateSecret();
    updateEnv('BETTER_AUTH_SECRET', secret);
    log.success('BETTER_AUTH_SECRET generated and saved');
  } else {
    log.success('BETTER_AUTH_SECRET already configured');
  }

  // Step 4: Generate Prisma Client
  log.info('\nStep 3: Setting up Database');
  log.info('Generating Prisma Client...');
  if (!exec('pnpm exec prisma generate')) {
    log.error('Failed to generate Prisma Client');
    process.exit(1);
  }
  log.success('Prisma Client generated');

  // Step 5: Run migrations
  log.info('Running database migrations...');
  if (!exec('pnpm exec prisma migrate deploy')) {
    log.warn('Migration deploy failed, attempting migrate dev...');
    if (!exec('pnpm exec prisma migrate dev --name init')) {
      log.error('Failed to run migrations');
      process.exit(1);
    }
  }
  log.success('Database migrations completed');

  // Step 6: Build check
  log.info('\nStep 4: Verifying build...');
  if (!exec('pnpm build')) {
    log.error('Build failed - please check for errors');
    process.exit(1);
  }
  log.success('Build successful');

  // Success message
  console.log('\n' + colors.blue + '========================================' + colors.reset);
  console.log(colors.green + '✓ Project setup completed successfully!' + colors.reset);
  console.log(colors.blue + '========================================' + colors.reset + '\n');

  console.log(colors.blue + 'Next steps:' + colors.reset);
  console.log('1. Review your .env file to ensure all values are correct');
  console.log(`2. Run ${colors.yellow}pnpm dev${colors.reset} to start the development server`);
  console.log(`3. Open ${colors.yellow}http://localhost:3000${colors.reset} in your browser\n`);

  console.log(colors.blue + 'Useful commands:' + colors.reset);
  console.log(`  ${colors.yellow}pnpm dev${colors.reset}                       - Start development server`);
  console.log(`  ${colors.yellow}pnpm exec prisma studio${colors.reset}       - Open Prisma Studio`);
  console.log(`  ${colors.yellow}pnpm exec prisma migrate dev${colors.reset}  - Create a new migration`);
  console.log(`  ${colors.yellow}pnpm setup${colors.reset}                    - Re-run this setup script\n`);
}

setup().catch(error => {
  log.error(error.message);
  process.exit(1);
});
