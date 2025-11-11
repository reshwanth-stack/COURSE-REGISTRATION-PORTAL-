const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

const init = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      capacity INTEGER DEFAULT 50
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_id INTEGER,
      UNIQUE(user_id, course_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(course_id) REFERENCES courses(id)
    )`);

    // Default user
    db.get('SELECT COUNT(*) as c FROM users', (err, row) => {
      if (row.c === 0) {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['student1', '12345']);
      }
    });

    // Default courses
    db.get('SELECT COUNT(*) as c FROM courses', (err, row) => {
      if (row.c === 0) {
        const stmt = db.prepare('INSERT INTO courses (code, title, capacity) VALUES (?, ?, ?)');
        stmt.run('CS101', 'Computer Science Basics', 100);
        stmt.run('MA101', 'Mathematics I', 80);
        stmt.run('EN101', 'English Literature', 60);
        stmt.finalize();
      }
    });
  });
};

module.exports = { db, init };
