#!/usr/bin/env node

/**
 * migrate_bolt_to_supabase.js
 *
 * Usage:
 *   SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *   node scripts/migrate_bolt_to_supabase.js /path/to/bolt.sqlite
 *
 * The script reads common tables from a Bolt SQLite DB and inserts rows into
 * corresponding Supabase tables using the service role key. It attempts to
 * map common columns; you should review output and Supabase to confirm and
 * adjust mappings if necessary.
 *
 * Notes:
 * - Auth users (passwords) are NOT migrated - Supabase auth users must be
 *   created separately. We can insert rows into the `profiles` table if you
 *   have matching user IDs, but auth.users entries won't exist automatically.
 * - This script expects a Supabase project with the target tables already
 *   created (run the SQL migrations in `supabase/migrations` first).
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const boltDbPath = process.argv[2] || 'bolt.sqlite';

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.');
    process.exit(1);
  }

  if (!fs.existsSync(boltDbPath)) {
    console.error(`Bolt SQLite file not found at ${boltDbPath}`);
    process.exit(1);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const db = await open({ filename: boltDbPath, driver: sqlite3.Database });

  // Utility: read all rows from a table if it exists
  async function readTableIfExists(tableName) {
    try {
      const rows = await db.all(`SELECT * FROM ${tableName}`);
      return rows || [];
    } catch (err) {
      // table probably doesn't exist
      return null;
    }
  }

  // 1) profiles
  const profiles = await readTableIfExists('profiles');
  if (profiles && profiles.length) {
    console.log(`Found ${profiles.length} profiles — inserting into Supabase 'profiles' table.`);
    for (const r of profiles) {
      // Keep as-is; ensure id matches auth.users.id if you plan to map users
      const insert = { ...r };
      try {
        const { data, error } = await supabase.from('profiles').upsert(insert);
        if (error) console.error('profiles upsert error', error);
      } catch (err) {
        console.error('profiles insert failed', err);
      }
    }
  } else console.log('No profiles table or empty.');

  // 2) study_classes -> study_classes
  const classes = await readTableIfExists('study_classes') || await readTableIfExists('classes') || await readTableIfExists('subjects');
  if (classes && classes.length) {
    console.log(`Found ${classes.length} classes — inserting into Supabase 'study_classes' table.`);
    for (const r of classes) {
      const insert = {
        id: r.id || r._id || undefined,
        user_id: r.user_id || r.owner_id || r.user || undefined,
        name: r.name || r.title || 'Untitled',
        description: r.description || '',
        color: r.color || '#3b82f6',
        icon: r.icon || 'BookOpen',
        total_study_time: r.total_study_time || r.totalStudyTime || 0,
        mastery_level: r.mastery_level || r.masteryLevel || 0,
        last_studied: r.last_studied || r.lastStudied || null,
        created_at: r.created_at || r.createdAt || new Date().toISOString(),
        updated_at: r.updated_at || r.updatedAt || new Date().toISOString()
      };
      try {
        const { data, error } = await supabase.from('study_classes').upsert(insert);
        if (error) console.error('classes upsert error', error);
      } catch (err) {
        console.error('classes insert failed', err);
      }
    }
  } else console.log('No classes table found in Bolt DB.');

  // 3) study_materials
  const materials = await readTableIfExists('study_materials') || await readTableIfExists('materials') || [];
  if (materials && materials.length) {
    console.log(`Found ${materials.length} materials — inserting into Supabase 'study_materials' table.`);
    for (const r of materials) {
      const insert = {
        id: r.id || r._id || undefined,
        user_id: r.user_id || r.user || undefined,
        class_id: r.class_id || r.study_class_id || r.subjectId || r.classId || undefined,
        title: r.title || r.name || 'Untitled',
        content: r.content || r.body || '',
        type: r.type || 'text',
        difficulty: r.difficulty || 'medium',
        tags: r.tags || (r.tags_json ? JSON.parse(r.tags_json) : null) || [],
        last_reviewed: r.last_reviewed || r.lastReviewed || null,
        file_url: r.file_url || r.fileUrl || r.url || '',
        created_at: r.created_at || r.createdAt || new Date().toISOString(),
        updated_at: r.updated_at || r.updatedAt || new Date().toISOString()
      };
      try {
        const { data, error } = await supabase.from('study_materials').upsert(insert);
        if (error) console.error('materials upsert error', error);
      } catch (err) {
        console.error('materials insert failed', err);
      }
    }
  } else console.log('No study_materials table found.');

  // 4) study_sessions
  const sessions = await readTableIfExists('study_sessions') || await readTableIfExists('sessions') || [];
  if (sessions && sessions.length) {
    console.log(`Found ${sessions.length} sessions — inserting into Supabase 'study_sessions' table.`);
    for (const r of sessions) {
      const insert = {
        id: r.id || r._id || undefined,
        user_id: r.user_id || r.user || undefined,
        class_id: r.class_id || r.study_class_id || undefined,
        material_id: r.material_id || r.materialId || null,
        title: r.title || '',
        method: r.method || 'review',
        start_time: r.start_time || r.startTime || new Date().toISOString(),
        end_time: r.end_time || r.endTime || null,
        duration: r.duration || 0,
        score: r.score || null,
        notes: r.notes || '',
        completed: r.completed === undefined ? false : !!r.completed,
        session_type: r.session_type || r.type || 'review',
        priority: r.priority || 'medium',
        scheduled_date: r.scheduled_date || null,
        scheduled_time: r.scheduled_time || null,
        created_at: r.created_at || new Date().toISOString()
      };
      try {
        const { data, error } = await supabase.from('study_sessions').upsert(insert);
        if (error) console.error('sessions upsert error', error);
      } catch (err) {
        console.error('sessions insert failed', err);
      }
    }
  } else console.log('No study_sessions table found.');

  // 5) flashcards
  const flashcards = await readTableIfExists('flashcards') || [];
  if (flashcards && flashcards.length) {
    console.log(`Found ${flashcards.length} flashcards — inserting into Supabase 'flashcards' table.`);
    for (const r of flashcards) {
      const insert = {
        id: r.id || r._id || undefined,
        user_id: r.user_id || r.user || undefined,
        material_id: r.material_id || r.materialId || undefined,
        front: r.front || r.question || '',
        back: r.back || r.answer || '',
        difficulty: r.difficulty || 'medium',
        review_count: r.review_count || 0,
        correct_count: r.correct_count || 0,
        ease_factor: r.ease_factor || 2.5,
        interval: r.interval || 1,
        last_reviewed: r.last_reviewed || null,
        next_review: r.next_review || null,
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString()
      };
      try {
        const { data, error } = await supabase.from('flashcards').upsert(insert);
        if (error) console.error('flashcards upsert error', error);
      } catch (err) {
        console.error('flashcards insert failed', err);
      }
    }
  } else console.log('No flashcards table found.');

  // 6) study_goals
  const goals = await readTableIfExists('study_goals') || await readTableIfExists('goals') || [];
  if (goals && goals.length) {
    console.log(`Found ${goals.length} goals — inserting into Supabase 'study_goals' table.`);
    for (const r of goals) {
      const insert = {
        id: r.id || r._id || undefined,
        user_id: r.user_id || r.user || undefined,
        title: r.title || '',
        description: r.description || '',
        target_date: r.target_date || r.targetDate || null,
        progress: r.progress || 0,
        completed: !!r.completed,
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString()
      };
      try {
        const { data, error } = await supabase.from('study_goals').upsert(insert);
        if (error) console.error('goals upsert error', error);
      } catch (err) {
        console.error('goals insert failed', err);
      }
    }
  } else console.log('No study_goals table found.');

  // 7) user_settings (optional)
  const settings = await readTableIfExists('user_settings') || await readTableIfExists('settings') || [];
  if (settings && settings.length) {
    console.log(`Found ${settings.length} user_settings rows — inserting into Supabase 'user_settings' table.`);
    for (const r of settings) {
      const insert = { ...r };
      try {
        const { data, error } = await supabase.from('user_settings').upsert(insert);
        if (error) console.error('user_settings upsert error', error);
      } catch (err) {
        console.error('user_settings insert failed', err);
      }
    }
  } else console.log('No user_settings table found.');

  console.log('Migration finished. Please verify data in Supabase and run any application-specific checks.');
  await db.close();
}

run().catch(err => {
  console.error('Migration script error', err);
  process.exit(1);
});
