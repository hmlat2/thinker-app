#!/usr/bin/env node
/**
 * migrate_postgres_to_supabase.js
 *
 * Usage:
 *   SOURCE_PG_CONNECTION=postgres://user:pass@host:5432/dbname \
 *   SUPABASE_URL=https://your-project.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
 *   node scripts/migrate_postgres_to_supabase.js
 *
 * The script connects to a source Postgres database (your Bolt DB), reads
 * common tables, and upserts rows into a target Supabase project using the
 * service role key. It preserves IDs where possible.
 *
 * Security: provide a readonly/limited source DB user if possible. The
 * SUPABASE_SERVICE_ROLE_KEY gives full write access to your Supabase DB;
 * rotate it after the migration.
 */

const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

async function readQuery(client, sql) {
  try {
    const res = await client.query(sql);
    return res.rows || [];
  } catch (err) {
    return null;
  }
}

async function upsertRows(supabase, table, rows) {
  for (const r of rows) {
    try {
      const { error } = await supabase.from(table).upsert(r);
      if (error) console.error(`${table} upsert error:`, error.message || error);
    } catch (err) {
      console.error(`${table} insert failed:`, err.message || err);
    }
  }
}

async function run() {
  const sourceConn = process.env.SOURCE_PG_CONNECTION || process.argv[2];
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!sourceConn) {
    console.error('Please set SOURCE_PG_CONNECTION env var or pass as first arg');
    process.exit(1);
  }
  if (!supabaseUrl || !supabaseKey) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
    process.exit(1);
  }

  const src = new Client({ connectionString: sourceConn });
  await src.connect();

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Reading profiles...');
  const profiles = await readQuery(src, 'SELECT * FROM profiles');
  if (profiles && profiles.length) {
    console.log(`Found ${profiles.length} profiles`);
    await upsertRows(supabase, 'profiles', profiles);
  } else console.log('No profiles table or empty');

  console.log('Reading study_classes...');
  const classes = await readQuery(src, 'SELECT * FROM study_classes');
  if (classes && classes.length) {
    console.log(`Found ${classes.length} classes`);
    await upsertRows(supabase, 'study_classes', classes);
  } else console.log('No study_classes table or empty');

  console.log('Reading study_materials...');
  const materials = await readQuery(src, 'SELECT * FROM study_materials');
  if (materials && materials.length) {
    console.log(`Found ${materials.length} materials`);
    await upsertRows(supabase, 'study_materials', materials);
  } else console.log('No study_materials table or empty');

  console.log('Reading study_sessions...');
  const sessions = await readQuery(src, 'SELECT * FROM study_sessions');
  if (sessions && sessions.length) {
    console.log(`Found ${sessions.length} sessions`);
    await upsertRows(supabase, 'study_sessions', sessions);
  } else console.log('No study_sessions table or empty');

  console.log('Reading flashcards...');
  const flashcards = await readQuery(src, 'SELECT * FROM flashcards');
  if (flashcards && flashcards.length) {
    console.log(`Found ${flashcards.length} flashcards`);
    await upsertRows(supabase, 'flashcards', flashcards);
  } else console.log('No flashcards table or empty');

  console.log('Reading study_goals...');
  const goals = await readQuery(src, 'SELECT * FROM study_goals');
  if (goals && goals.length) {
    console.log(`Found ${goals.length} goals`);
    await upsertRows(supabase, 'study_goals', goals);
  } else console.log('No study_goals table or empty');

  console.log('Reading user_settings...');
  const settings = await readQuery(src, 'SELECT * FROM user_settings');
  if (settings && settings.length) {
    console.log(`Found ${settings.length} user_settings rows`);
    await upsertRows(supabase, 'user_settings', settings);
  } else console.log('No user_settings table or empty');

  await src.end();
  console.log('Migration finished. Verify data in Supabase dashboard.');
}

run().catch(err => {
  console.error('Migration error', err);
  process.exit(1);
});
