#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Constraintly - Database Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    if [ -f .env.example ]; then
        echo -e "${YELLOW}Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created${NC}"
        echo -e "${YELLOW}Please update the DATABASE_URL in .env with your PostgreSQL connection string${NC}\n"
    else
        echo -e "${RED}✗ .env.example not found${NC}"
        exit 1
    fi
fi

# Extract DATABASE_URL from .env
DATABASE_URL=$(grep "^DATABASE_URL" .env | cut -d'=' -f2 | tr -d '"')

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}✗ DATABASE_URL not set in .env file${NC}"
    exit 1
fi

echo -e "${BLUE}Database Setup Steps:${NC}\n"

echo -e "${YELLOW}1️⃣  Checking PostgreSQL connection...${NC}"
# Try to connect to the database
if command -v psql &> /dev/null; then
    # Extract connection details from DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL connection successful${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Could not connect to PostgreSQL${NC}"
        echo -e "${YELLOW}Make sure PostgreSQL is running and DATABASE_URL is correct${NC}"
        echo -e "${YELLOW}DATABASE_URL: $DATABASE_URL\n${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  psql not found, skipping connection test${NC}"
    echo -e "${YELLOW}DATABASE_URL: $DATABASE_URL\n${NC}"
fi

echo -e "${YELLOW}2️⃣  Generating Prisma Client...${NC}"
pnpm exec prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma Client generated${NC}\n"
else
    echo -e "${RED}✗ Failed to generate Prisma Client${NC}"
    exit 1
fi

echo -e "${YELLOW}3️⃣  Running Prisma Migrations...${NC}"
pnpm exec prisma migrate deploy
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations completed${NC}\n"
else
    echo -e "${YELLOW}⚠️  Migration deploy failed. Running migrate dev...${NC}"
    pnpm exec prisma migrate dev --name init
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database migrations completed${NC}\n"
    else
        echo -e "${RED}✗ Failed to run migrations${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}4️⃣  Generating BETTER_AUTH_SECRET...${NC}"
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    
    # Update .env file with the secret if not already set
    if grep -q "BETTER_AUTH_SECRET=" .env && ! grep -q "BETTER_AUTH_SECRET=\"your-secret" .env; then
        echo -e "${GREEN}✓ BETTER_AUTH_SECRET already configured${NC}\n"
    else
        # Create a backup and update
        cp .env .env.backup
        sed -i.bak "s/BETTER_AUTH_SECRET=.*/BETTER_AUTH_SECRET=\"$SECRET\"/" .env
        rm -f .env.bak
        echo -e "${GREEN}✓ BETTER_AUTH_SECRET generated and saved to .env${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  openssl not found, skipping SECRET generation${NC}"
    echo -e "${YELLOW}Please manually set BETTER_AUTH_SECRET in .env${NC}\n"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Database setup completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Review your .env file to ensure all values are correct"
echo -e "2. Run ${YELLOW}pnpm dev${NC} to start the development server"
echo -e "3. Open ${YELLOW}http://localhost:3000${NC} in your browser\n"

echo -e "${BLUE}Useful commands:${NC}"
echo -e "  ${YELLOW}pnpm exec prisma studio${NC}     - Open Prisma Studio to view/edit database"
echo -e "  ${YELLOW}pnpm exec prisma migrate dev${NC} - Create a new migration"
echo -e "  ${YELLOW}pnpm setup${NC}                   - Re-run this setup script\n"
