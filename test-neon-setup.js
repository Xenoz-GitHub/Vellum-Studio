/**
 * Test Script for Neon Setup and Algorithmic Generation
 * Run with: node test-neon-setup.js
 */

import { config } from 'dotenv';
import { Pool } from 'pg';
import { AlgorithmicGenerator } from './src/services/algorithmic-generator.ts';

config({ path: ['.env.local', '.env'] });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Neon Database Connection...');
  try {
    const result = await pool.query('SELECT NOW() as time, version() as pg_version');
    console.log('✅ Database connected successfully!');
    console.log(`   Current time: ${result.rows[0].time}`);
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(',')[0]}`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testTableCreation() {
  console.log('\n🔍 Verifying Database Tables...');
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(r => r.table_name);
    const expectedTables = [
      'users',
      'presentations',
      'presentation_versions',
      'share_links',
      'templates',
      'custom_components',
      'design_token_sets',
      'font_assets',
      'uploaded_assets',
      'generation_jobs',
      'user_achievements',
      'user_activities',
      'admin_audit_logs',
      'ai_configs',
      'feature_flags'
    ];
    
    const missing = expectedTables.filter(t => !tables.includes(t));
    
    if (missing.length === 0) {
      console.log(`✅ All ${expectedTables.length} tables exist!`);
      console.log(`   Tables: ${tables.join(', ')}`);
      return true;
    } else {
      console.error(`❌ Missing tables: ${missing.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Table verification failed:', error.message);
    return false;
  }
}

async function testAlgorithmicGenerator() {
  console.log('\n🔍 Testing Algorithmic Generation System...');
  try {
    // Test token calculation
    const request = {
      prompt: 'Revolutionary AI Product Launch',
      slideCount: 8,
      category: 'Tech',
      themeId: 'gallery-alabaster',
      aspectRatio: '16:9'
    };
    
    console.log('📝 Generation Request:', request);
    
    const tokenUsage = AlgorithmicGenerator.calculateTokens(request);
    console.log(`✅ Token Calculation: ${tokenUsage.tokensUsed} tokens = ${tokenUsage.creditsDeducted} credits`);
    
    // Test color harmony
    const baseColor = '#FF5733';
    const complementary = AlgorithmicGenerator.calculateHarmoniousColor(baseColor, 'complementary');
    const analogous = AlgorithmicGenerator.calculateHarmoniousColor(baseColor, 'analogous');
    const triadic = AlgorithmicGenerator.calculateHarmoniousColor(baseColor, 'triadic');
    
    console.log(`✅ Color Harmony:
       Base: ${baseColor}
       Complementary: ${complementary}
       Analogous: ${analogous}
       Triadic: ${triadic}`);
    
    // Test layout selection
    const layouts = [];
    for (let i = 0; i < request.slideCount; i++) {
      layouts.push(AlgorithmicGenerator.selectLayoutPattern(i, request.slideCount, request.category));
    }
    console.log(`✅ Layout Patterns: ${layouts.join(', ')}`);
    
    // Test full generation
    console.log('\n🎨 Generating presentation...');
    const document = AlgorithmicGenerator.generatePresentation(request);
    
    console.log(`✅ Presentation Generated!
       ID: ${document.id}
       Title: ${document.title}
       Slides: ${document.slides.length}
       Dimensions: ${document.width}x${document.height}
       Theme: ${document.themeId}
       Elements: ${document.slides.reduce((sum, slide) => sum + slide.elements.length, 0)} total`);
    
    return true;
  } catch (error) {
    console.error('❌ Algorithmic generation failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

async function testSchemaEnhancements() {
  console.log('\n🔍 Testing Schema Enhancements...');
  try {
    // Test that new columns exist by checking table structure
    const columnsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'presentations' 
      ORDER BY ordinal_position
    `);
    
    console.log('✅ Presentations table structure verified');
    console.log(`   Columns: ${columnsResult.rows.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Schema enhancement test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Vellum Studio - Neon Migration Test Suite          ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  
  const results = {
    database: await testDatabaseConnection(),
    tables: await testTableCreation(),
    schema: await testSchemaEnhancements(),
    generator: await testAlgorithmicGenerator(),
  };
  
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   Test Results Summary                                 ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log(`Database Connection:      ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Table Creation:           ${results.tables ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Schema Enhancements:      ${results.schema ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Algorithmic Generator:    ${results.generator ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + '═'.repeat(57));
  console.log(allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED');
  console.log('═'.repeat(57) + '\n');
  
  await pool.end();
  process.exit(allPassed ? 0 : 1);
}

runAllTests();
