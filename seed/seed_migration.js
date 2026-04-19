/**
 * Teachs — Syllabus & Attendance Migration
 * Run ONCE on your existing database to add new tables/columns.
 * Command: node seed/seed_migration.js
 */
require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'teachs_db',
    multipleStatements: true,
  });

  console.log('✅ Connected — running migration...');

  // 1. Extend attendance table with topic tracking columns
  const alterCols = [
    `ALTER TABLE attendance ADD COLUMN topic_taught TEXT`,
    `ALTER TABLE attendance ADD COLUMN sub_topic VARCHAR(200)`,
    `ALTER TABLE attendance ADD COLUMN homework_given TEXT`,
    `ALTER TABLE attendance ADD COLUMN class_rating TINYINT DEFAULT NULL`,
  ];

  for (const q of alterCols) {
    try {
      await conn.query(q);
      console.log('✅ Column added:', q.split('ADD COLUMN')[1].trim().split(' ')[0]);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  Column already exists — skipping');
      } else {
        throw e;
      }
    }
  }

  // 2. Create syllabus tables
  await conn.query(`
    CREATE TABLE IF NOT EXISTS syllabus_subjects (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id  INT NOT NULL,
      student_id  INT NOT NULL,
      subject_name VARCHAR(100) NOT NULL,
      created_at  DATETIME DEFAULT NOW(),
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS syllabus_chapters (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      subject_id   INT NOT NULL,
      chapter_name VARCHAR(200) NOT NULL,
      sort_order   INT DEFAULT 99,
      FOREIGN KEY (subject_id) REFERENCES syllabus_subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS syllabus_subtopics (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      chapter_id    INT NOT NULL,
      subtopic_name VARCHAR(200) NOT NULL,
      status        ENUM('not_started','in_progress','completed') DEFAULT 'not_started',
      sort_order    INT DEFAULT 99,
      FOREIGN KEY (chapter_id) REFERENCES syllabus_chapters(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ syllabus_subjects, syllabus_chapters, syllabus_subtopics — created (or already exist)');
  console.log('\n✅ Migration complete! You can now deploy the new route/frontend files.\n');

  await conn.end();
}

migrate().catch(e => {
  console.error('❌ Migration failed:', e.message);
  process.exit(1);
});
