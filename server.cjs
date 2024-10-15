const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    level TEXT,
    phone TEXT,
    email TEXT,
    payment TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date DATEs,
    theme TEXT,
    skills TEXT
  )`);
});

app.get('/api/students', (req, res) => {
  db.all('SELECT * FROM students', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/students', (req, res) => {
  const { name, age, level, phone, email, payment } = req.body;
  db.run('INSERT INTO students (name, age, level, phone, email, payment) VALUES (?, ?, ?, ?, ?, ?)',
    [name, age, level, phone, email, payment],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/students/:id', (req, res) => {
  const { name, age, level, phone, email, payment } = req.body;
  db.run('UPDATE students SET name = ?, age = ?, level = ?, phone = ?, email = ?, payment = ? WHERE id = ?',
    [name, age, level, phone, email, payment, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Student updated successfully' });
    }
  );
});

app.delete('/api/students/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  });
});

app.get('/api/classes', (req, res) => {
  db.all('SELECT * FROM classes', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/classes', (req, res) => {
  const { title, date, theme, skills } = req.body;
  db.run('INSERT INTO classes (title, date, theme, skills) VALUES (?, ?, ?, ?)',
    [title, date, theme, skills],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/classes/:id', (req, res) => {
  const { title, date, theme, skills } = req.body;
  db.run('UPDATE classes SET title = ?, date = ?, theme = ?, skills = ? WHERE id = ?',
    [title, date, theme, skills, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Class updated successfully' });
    }
  );
});

app.delete('/api/classes/:id', (req, res) => {
  db.run('DELETE FROM classes WHERE id = ?', req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Class deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
