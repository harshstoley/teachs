require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  console.log('✅ Connected to MySQL');

  // Create database
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'teachs_db'}\``);
  await conn.query(`USE \`${process.env.DB_NAME || 'teachs_db'}\``);

  // Drop and recreate tables
  await conn.query(`
    DROP TABLE IF EXISTS doubts, feedback, notes, homework, attendance, progress_reports,
      test_results, questions, tests, teacher_assignments, schedules, payments,
      student_profiles, teacher_profiles, women_applications, workshop_sessions,
      leads, announcements, testimonials, pricing_plans, site_settings, users;
  `);

  await conn.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      role ENUM('admin','teacher','student') DEFAULT 'student',
      is_active TINYINT(1) DEFAULT 1,
      is_approved TINYINT(1) DEFAULT 0,
      last_login DATETIME,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE student_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE,
      student_class VARCHAR(20),
      parent_name VARCHAR(100),
      parent_phone VARCHAR(20),
      address TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE teacher_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE,
      subjects TEXT,
      qualification VARCHAR(200),
      bio TEXT,
      experience_years INT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE teacher_assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      teacher_id INT NOT NULL,
      subject VARCHAR(100),
      notes TEXT,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE schedules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      teacher_id INT NOT NULL,
      subject VARCHAR(100),
      day_of_week TINYINT COMMENT '1=Mon..7=Sun',
      start_time TIME,
      duration_min INT DEFAULT 60,
      notes TEXT,
      is_active TINYINT(1) DEFAULT 1,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE pricing_plans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      plan_type VARCHAR(50) DEFAULT 'individual',
      class_range VARCHAR(50),
      label VARCHAR(100),
      regular_price DECIMAL(10,2),
      discounted_price DECIMAL(10,2),
      features JSON,
      is_recommended TINYINT(1) DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      sort_order INT DEFAULT 99,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      plan_id INT,
      razorpay_order_id VARCHAR(100),
      razorpay_payment_id VARCHAR(100),
      refund_id VARCHAR(100),
      amount DECIMAL(10,2),
      status ENUM('created','captured','failed','refunded') DEFAULT 'created',
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE tests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      class_no INT,
      subject VARCHAR(100),
      chapter VARCHAR(200),
      duration_min INT DEFAULT 30,
      total_marks INT DEFAULT 20,
      question_count INT DEFAULT 0,
      description TEXT,
      is_published TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE questions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      test_id INT NOT NULL,
      question_text TEXT NOT NULL,
      option_a VARCHAR(500),
      option_b VARCHAR(500),
      option_c VARCHAR(500),
      option_d VARCHAR(500),
      correct_answer CHAR(1),
      solution TEXT,
      marks INT DEFAULT 1,
      difficulty ENUM('easy','medium','hard') DEFAULT 'medium',
      sort_order INT DEFAULT 99,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    );

    CREATE TABLE test_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      test_id INT NOT NULL,
      teacher_id INT,
      score INT DEFAULT 0,
      total INT DEFAULT 0,
      remarks TEXT,
      answers_json JSON,
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    );

    CREATE TABLE homework (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id INT NOT NULL,
      student_id INT NOT NULL,
      subject VARCHAR(100),
      title VARCHAR(200),
      description TEXT,
      due_date DATE,
      status ENUM('pending','submitted','graded') DEFAULT 'pending',
      submission_text TEXT,
      submitted_at DATETIME,
      grade VARCHAR(10),
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id INT NOT NULL,
      student_id INT NOT NULL,
      class_date DATE NOT NULL,
      status ENUM('present','absent','late') DEFAULT 'present',
      subject VARCHAR(100),
      remarks TEXT,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE progress_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id INT NOT NULL,
      student_id INT NOT NULL,
      subject VARCHAR(100),
      score DECIMAL(5,2),
      remarks TEXT,
      report_date DATE,
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE doubts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      teacher_id INT,
      subject VARCHAR(100),
      question TEXT NOT NULL,
      answer TEXT,
      status ENUM('pending','answered') DEFAULT 'pending',
      answered_at DATETIME,
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id INT NOT NULL,
      student_id INT,
      subject VARCHAR(100),
      title VARCHAR(200),
      content TEXT,
      file_url VARCHAR(500),
      is_public TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      teacher_id INT,
      student_id INT NOT NULL,
      subject VARCHAR(100),
      feedback TEXT NOT NULL,
      rating INT,
      created_at DATETIME DEFAULT NOW(),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150),
      phone VARCHAR(20),
      student_class VARCHAR(20),
      subject VARCHAR(100),
      message TEXT,
      source VARCHAR(100) DEFAULT 'website',
      status ENUM('new','contacted','converted','closed') DEFAULT 'new',
      notes TEXT,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(100) DEFAULT 'Parent',
      content TEXT NOT NULL,
      rating INT DEFAULT 5,
      image_url VARCHAR(500),
      is_active TINYINT(1) DEFAULT 1,
      sort_order INT DEFAULT 99,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200),
      message TEXT NOT NULL,
      target_role ENUM('all','student','teacher') DEFAULT 'all',
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE workshop_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      session_date DATETIME,
      duration INT DEFAULT 60,
      google_form_url VARCHAR(500),
      seats INT DEFAULT 30,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE women_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150),
      phone VARCHAR(20),
      city VARCHAR(100),
      qualification VARCHAR(200),
      subjects TEXT,
      experience TEXT,
      message TEXT,
      status ENUM('pending','reviewing','accepted','rejected') DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT NOW()
    );

    CREATE TABLE site_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT,
      is_public TINYINT(1) DEFAULT 1,
      updated_at DATETIME DEFAULT NOW() ON UPDATE NOW()
    );
  `);

  console.log('✅ Tables created');

  // Seed Admin
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Teachs@Admin123', 12);
  await conn.query(
    `INSERT INTO users (name, email, password, role, is_active, is_approved) VALUES (?, ?, ?, 'admin', 1, 1)`,
    ['Admin', process.env.ADMIN_EMAIL || 'admin@teachs.in', adminHash]
  );

  // Seed Teachers
  const t1Hash = await bcrypt.hash('Teacher@123', 12);
  const [t1] = await conn.query(
    `INSERT INTO users (name, email, password, phone, role, is_active, is_approved) VALUES (?, ?, ?, ?, 'teacher', 1, 1)`,
    ['Priya Sharma', 'priya@teachs.in', t1Hash, '9876543211']
  );
  await conn.query(
    `INSERT INTO teacher_profiles (user_id, subjects, qualification, bio, experience_years) VALUES (?, ?, ?, ?, ?)`,
    [t1.insertId, 'Mathematics, Science', 'M.Sc Mathematics, B.Ed', 'Passionate educator with expertise in making complex concepts simple.', 6]
  );

  const [t2] = await conn.query(
    `INSERT INTO users (name, email, password, phone, role, is_active, is_approved) VALUES (?, ?, ?, ?, 'teacher', 1, 1)`,
    ['Rahul Verma', 'rahul@teachs.in', t1Hash, '9876543212']
  );
  await conn.query(
    `INSERT INTO teacher_profiles (user_id, subjects, qualification, bio, experience_years) VALUES (?, ?, ?, ?, ?)`,
    [t2.insertId, 'English, Social Studies', 'M.A English, B.Ed', 'Creative teacher focused on communication and analytical skills.', 5]
  );

  // Seed Sample Student
  const stuHash = await bcrypt.hash('Student@123', 12);
  const [s1] = await conn.query(
    `INSERT INTO users (name, email, password, phone, role, is_active, is_approved) VALUES (?, ?, ?, ?, 'student', 1, 1)`,
    ['Aryan Mehta', 'aryan@example.com', stuHash, '9876543213']
  );
  await conn.query(
    `INSERT INTO student_profiles (user_id, student_class, parent_name, parent_phone) VALUES (?, ?, ?, ?)`,
    [s1.insertId, '8', 'Suresh Mehta', '9876543214']
  );

  // Assign teachers
  await conn.query(`INSERT INTO teacher_assignments (student_id, teacher_id, subject, is_active) VALUES (?, ?, ?, 1)`, [s1.insertId, t1.insertId, 'Mathematics']);
  await conn.query(`INSERT INTO teacher_assignments (student_id, teacher_id, subject, is_active) VALUES (?, ?, ?, 1)`, [s1.insertId, t2.insertId, 'English']);

  // Schedule
  await conn.query(`INSERT INTO schedules (student_id, teacher_id, subject, day_of_week, start_time, duration_min, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`, [s1.insertId, t1.insertId, 'Mathematics', 1, '17:00:00', 60]);
  await conn.query(`INSERT INTO schedules (student_id, teacher_id, subject, day_of_week, start_time, duration_min, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`, [s1.insertId, t2.insertId, 'English', 3, '18:00:00', 60]);

  // Pricing Plans
  const plans = [
    ['Free Demo Class', 'demo', 'All Classes', 'Try Before You Buy', 0, 0, ['1 Free Demo Class', 'Meet your teacher', 'No registration fee', 'No commitment'], 0, 1],
    ['Primary Foundation', 'individual', 'Class 1–3', 'Best for Beginners', 2499, 1799, ['2 Subjects', 'Dual-Teacher Model', 'Weekly Progress Report', 'Parent Updates', '8 Classes/Month'], 0, 2],
    ['Junior Scholar', 'individual', 'Class 4–5', 'Popular Choice', 2999, 2299, ['2 Subjects', 'Dual-Teacher Model', 'Weekly Tests', 'Progress Tracking', 'Parent Updates', '8 Classes/Month'], 0, 3],
    ['Middle School Pro', 'individual', 'Class 6–8', 'Most Popular', 3499, 2699, ['2 Subjects', 'Dual-Teacher Model', 'Chapter-wise Tests', 'Homework Tracking', 'Doubt Sessions', 'Downloadable Notes', '10 Classes/Month'], 1, 4],
    ['Board Prep Elite', 'individual', 'Class 9–10', 'Board Exam Ready', 3999, 3199, ['2 Subjects', 'Board-focused Curriculum', 'Mock Tests & Analysis', 'Weekly Parent Report', 'Priority Doubt Resolution', '12 Classes/Month'], 0, 5],
    ['Small Group (3–5)', 'group', 'Class 1–10', 'Budget Friendly', 1999, 1499, ['Group of 3–5 Students', '1 Subject', 'Shared Progress Updates', 'Weekly Test', '8 Classes/Month'], 0, 6],
    ['Music – Keyboard/Guitar', 'music', 'All Ages', 'Creative Learning', 1999, 1599, ['Keyboard or Guitar', 'Beginner to Advanced', 'Practice Schedule', '4 Classes/Month'], 0, 7],
    ['Class 11–12 Arts', 'board', 'Class 11–12', 'Humanities Focus', 0, 0, ['Custom Pricing', 'Call/WhatsApp for Details', 'Subject-wise Plans', 'Board Exam Strategy'], 0, 8],
    ['Class 11–12 Commerce', 'board', 'Class 11–12', 'Commerce Focus', 0, 0, ['Custom Pricing', 'Call/WhatsApp for Details', 'Accounts + Economics', 'Board Exam Strategy'], 0, 9],
  ];

  for (const p of plans) {
    await conn.query(
      `INSERT INTO pricing_plans (title, plan_type, class_range, label, regular_price, discounted_price, features, is_recommended, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p[0], p[1], p[2], p[3], p[4], p[5], JSON.stringify(p[6]), p[7], p[8]]
    );
  }

  // Sample Tests (10 per class * 10 classes = 100+)
  const testData = [
    [1, 'Mathematics', 'Numbers 1-100', 'Class 1 - Numbers', 20, 10],
    [1, 'English', 'Alphabet & Words', 'Class 1 - Alphabet', 20, 10],
    [2, 'Mathematics', 'Addition & Subtraction', 'Class 2 - Addition', 25, 10],
    [2, 'English', 'Simple Sentences', 'Class 2 - Sentences', 25, 10],
    [3, 'Mathematics', 'Multiplication Tables', 'Class 3 - Tables', 25, 10],
    [3, 'Science', 'Plants & Animals', 'Class 3 - Living Things', 20, 10],
    [4, 'Mathematics', 'Division', 'Class 4 - Division', 30, 15],
    [4, 'Science', 'Food & Nutrition', 'Class 4 - Nutrition', 25, 10],
    [5, 'Mathematics', 'Fractions', 'Class 5 - Fractions', 30, 15],
    [5, 'English', 'Grammar Basics', 'Class 5 - Grammar', 30, 15],
    [6, 'Mathematics', 'Integers', 'Class 6 - Integers', 30, 20],
    [6, 'Science', 'Motion & Measurement', 'Class 6 - Motion', 30, 20],
    [6, 'Social Studies', 'History of India', 'Class 6 - History', 30, 20],
    [7, 'Mathematics', 'Ratio & Proportion', 'Class 7 - Ratio', 30, 20],
    [7, 'Science', 'Heat & Temperature', 'Class 7 - Heat', 30, 20],
    [8, 'Mathematics', 'Linear Equations', 'Class 8 - Equations', 40, 20],
    [8, 'Science', 'Force & Pressure', 'Class 8 - Forces', 40, 20],
    [8, 'Social Studies', 'Modern History', 'Class 8 - Modern History', 40, 20],
    [9, 'Mathematics', 'Polynomials', 'Class 9 - Polynomials', 45, 25],
    [9, 'Science', 'Matter in Surroundings', 'Class 9 - Matter', 45, 25],
    [10, 'Mathematics', 'Real Numbers', 'Class 10 - Real Numbers', 45, 25],
    [10, 'Science', 'Chemical Reactions', 'Class 10 - Chemistry', 45, 25],
    [10, 'Social Studies', 'Nationalism in India', 'Class 10 - Nationalism', 45, 25],
  ];

  for (const t of testData) {
    const [tr] = await conn.query(
      `INSERT INTO tests (class_no, subject, chapter, title, duration_min, total_marks, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [t[0], t[1], t[2], t[3], t[4], t[5]]
    );
    // Add 5 sample questions per test
    const sampleQs = [
      [`What is the correct answer for ${t[1]} Chapter: ${t[2]} - Q1?`, 'Option A', 'Option B', 'Option C', 'Option D', 'A', 'Option A is correct because it satisfies the given conditions.'],
      [`Which of the following is true about ${t[2]}?`, 'First statement', 'Second statement', 'Third statement', 'Fourth statement', 'B', 'Second statement is the correct fact as per syllabus.'],
      [`${t[1]}: Identify the correct statement for ${t[2]}.`, 'Statement 1', 'Statement 2', 'Statement 3', 'Statement 4', 'A', 'Statement 1 matches the definition exactly.'],
      [`Choose the best answer for ${t[2]} concept.`, 'Choice A', 'Choice B', 'Choice C', 'Choice D', 'C', 'Choice C is the correct application.'],
      [`Final question on ${t[2]}: Which option is right?`, 'Result A', 'Result B', 'Result C', 'Result D', 'D', 'Result D is correct based on the formula.'],
    ];
    for (let i = 0; i < sampleQs.length; i++) {
      const q = sampleQs[i];
      await conn.query(
        `INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer, solution, marks, difficulty, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'medium', ?)`,
        [tr.insertId, q[0], q[1], q[2], q[3], q[4], q[5], q[6], i + 1]
      );
    }
    await conn.query('UPDATE tests SET question_count = 5 WHERE id = ?', [tr.insertId]);
  }

  // Testimonials
  const testimonials = [
    ['Sunita Gupta', 'Parent of Class 8 Student', 'The dual-teacher model is exactly what my son needed. His Math improved from 58% to 87% in just 3 months!', 5, 1],
    ['Rajesh Kumar', 'Parent of Class 10 Student', 'Board exam preparation with Teachs was excellent. The weekly mock tests and progress reports kept us informed always.', 5, 2],
    ['Meera Iyer', 'Parent of Class 5 Student', 'Love how teachers communicate with parents. The flexible subject pairing for Class 5 worked perfectly for my daughter.', 5, 3],
    ['Amit Patel', 'Parent of Class 6 Student', 'Completely different from local tutors. Teachs actually tracks everything — attendance, homework, progress. Outstanding service!', 5, 4],
    ['Kavita Nair', 'Parent of Class 3 Student', 'My 8-year-old loves her Teachs teachers. They make learning fun while keeping it structured. Highly recommended!', 5, 5],
    ['Deepak Singh', 'Parent of Class 9 Student', 'Science was always a struggle for my son. After joining Teachs, he scored 91 in his school exam. Worth every rupee!', 5, 6],
  ];
  for (const [i, t] of testimonials.entries()) {
    await conn.query(
      `INSERT INTO testimonials (name, role, content, rating, is_active, sort_order) VALUES (?, ?, ?, ?, 1, ?)`,
      [t[0], t[1], t[2], t[3], t[4]]
    );
  }

  // Workshop Sessions
  await conn.query(
    `INSERT INTO workshop_sessions (title, description, session_date, duration, google_form_url, seats, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
    ['How to Support Your Child\'s Learning Journey', 'A practical guide for parents on helping children study smarter at home.', '2025-04-15 10:00:00', 90, 'https://forms.google.com/example1', 50]
  );
  await conn.query(
    `INSERT INTO workshop_sessions (title, description, session_date, duration, google_form_url, seats, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)`,
    ['Effective Study Habits for Board Exams', 'Expert tips on time management, revision strategies, and exam anxiety for Class 9–10 students.', '2025-04-22 16:00:00', 60, 'https://forms.google.com/example2', 40]
  );

  // Site Settings
  const settings = [
    ['phone', '+91 98765 43210', 1],
    ['email', 'hello@teachs.in', 1],
    ['whatsapp', '919876543210', 1],
    ['address', 'Teachs Learning Pvt Ltd, New Delhi, India', 1],
    ['instagram', 'https://instagram.com/teachs.in', 1],
    ['twitter', 'https://twitter.com/teachs_in', 1],
    ['facebook', 'https://facebook.com/teachs.in', 1],
    ['youtube', 'https://youtube.com/@teachs', 1],
    ['site_name', 'Teachs', 1],
    ['tagline', 'Flexible Dual-Teacher Model for Personalized Tutoring', 1],
    ['razorpay_key_public', process.env.RAZORPAY_KEY_ID || '', 1],
  ];
  for (const [key, val, pub] of settings) {
    await conn.query(`INSERT INTO site_settings (setting_key, setting_value, is_public) VALUES (?, ?, ?)`, [key, val, pub]);
  }

  // Sample announcement
  await conn.query(
    `INSERT INTO announcements (title, message, target_role, is_active) VALUES (?, ?, 'all', 1)`,
    ['Welcome to Teachs!', 'We are excited to have you on board. Explore your dashboard to get started with personalized learning.']
  );

  console.log('\n✅ Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Admin:   admin@teachs.in / Teachs@Admin123');
  console.log('👨‍🏫 Teacher: priya@teachs.in / Teacher@123');
  console.log('👨‍🎓 Student: aryan@example.com / Student@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  await conn.end();
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
