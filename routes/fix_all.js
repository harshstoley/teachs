// Run ONCE: node routes/fix_all.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('✅ Connected');

  // 1. Add enrollment_no to student_profiles safely
  try {
    await conn.query(`ALTER TABLE student_profiles ADD COLUMN enrollment_no VARCHAR(20) UNIQUE`);
    console.log('✅ enrollment_no column added');
  } catch(e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⚠️  enrollment_no already exists');
    else console.log('enrollment_no:', e.message);
  }

  // 2. Add teacher_code to teacher_profiles safely
  try {
    await conn.query(`ALTER TABLE teacher_profiles ADD COLUMN teacher_code VARCHAR(20) UNIQUE`);
    console.log('✅ teacher_code column added');
  } catch(e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('⚠️  teacher_code already exists');
    else console.log('teacher_code:', e.message);
  }

  // 3. Generate enrollment for existing students
  const year = new Date().getFullYear();
  const [students] = await conn.query(
    `SELECT sp.id FROM student_profiles sp WHERE sp.enrollment_no IS NULL`
  );
  for (let i = 0; i < students.length; i++) {
    const num = String(i + 1).padStart(4, '0');
    try {
      await conn.query('UPDATE student_profiles SET enrollment_no=? WHERE id=?',
        [`TCH-${year}-${num}`, students[i].id]);
    } catch(e) { /* skip duplicate */ }
  }
  console.log(`✅ Enrollment IDs assigned to ${students.length} students`);

  // 4. Generate teacher codes for existing teachers
  const [teachers] = await conn.query(
    `SELECT tp.id FROM teacher_profiles tp WHERE tp.teacher_code IS NULL`
  );
  for (let i = 0; i < teachers.length; i++) {
    const num = String(i + 1).padStart(4, '0');
    try {
      await conn.query('UPDATE teacher_profiles SET teacher_code=? WHERE id=?',
        [`TCH-T-${num}`, teachers[i].id]);
    } catch(e) { /* skip duplicate */ }
  }
  console.log(`✅ Teacher codes assigned to ${teachers.length} teachers`);

  await conn.end();
  console.log('\n✅ All done! Restart your Node.js app now.');
  process.exit(0);
}

run().catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });
