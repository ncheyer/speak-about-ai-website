#!/usr/bin/env node
const { neon } = require("@neondatabase/serverless");
const fs = require("fs");
const path = require("path");

async function setupDatabase() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set");
      process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);
    console.log("Connected to database");

    // Read and execute the table creation script
    console.log("Creating deals table...");
    const createTableSQL = fs.readFileSync(
      path.join(__dirname, "create-deals-table.sql"),
      "utf8"
    );
    
    await sql(createTableSQL);
    console.log("✓ Deals table created successfully");

    // Read and execute the seed data script
    console.log("Seeding deals data...");
    const seedDataSQL = fs.readFileSync(
      path.join(__dirname, "seed-deals-data.sql"),
      "utf8"
    );
    
    await sql(seedDataSQL);
    console.log("✓ Deals data seeded successfully");

    console.log("Database setup completed!");
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
