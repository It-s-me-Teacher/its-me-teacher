const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;


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

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    email TEXT,
    password TEXT
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

app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  db.get('SELECT name FROM users WHERE name = ?', [name], async (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (user) {
      res.status(409).json({ error: 'Nome de usuário já existe' });
      return;
    }
    
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function(err) {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ id: this.lastID });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});


app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(404).json({ error: 'Usuario não encontrado' });
      return;
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Senha inválida' });
    }
  });
});

app.put('/api/users/:id', async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.id;
  
  try {
    let updates = [];
    let values = [];
    
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password) {
      updates.push('password = ?');
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      values.push(hashedPassword);
    }
    
    values.push(userId);
    
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, values, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.get('SELECT id, name, email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(user);
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT id, name, email FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
