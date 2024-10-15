import sqlite3 from "sqlite3";

const studentsData = [
  {
    name: "Alisson Becker",
    age: "31",
    level: "Fluent",
    phone: "(31)9 8888-8888",
    email: "alisson.becker@gmail.com",
    payment: "pix",
  },
  {
    name: "Virgil van Dijk",
    age: "32",
    level: "Fluent",
    phone: "(31)9 7777-7777",
    email: "virgil.vandijk@gmail.com",
    payment: "pix",
  },
  {
    name: "Trent Alexander-Arnold",
    age: "25",
    level: "Fluent",
    phone: "(31)9 6666-6666",
    email: "trent.alexander@gmail.com",
    payment: "pix",
  },
  {
    name: "Andrew Robertson",
    age: "30",
    level: "Fluent",
    phone: "(31)9 5555-5555",
    email: "andrew.robertson@gmail.com",
    payment: "pix",
  },
  {
    name: "Ibrahima Konaté",
    age: "24",
    level: "Fluent",
    phone: "(31)9 4444-4444",
    email: "ibrahima.konate@gmail.com",
    payment: "pix",
  },
  {
    name: "Jordan Henderson",
    age: "34",
    level: "Fluent",
    phone: "(31)9 3333-3333",
    email: "jordan.henderson@gmail.com",
    payment: "pix",
  },
  {
    name: "Curtis Jones",
    age: "23",
    level: "Fluent",
    phone: "(31)9 2222-2222",
    email: "curtis.jones@gmail.com",
    payment: "pix",
  },
  {
    name: "Dominik Szoboszlai",
    age: "23",
    level: "Fluent",
    phone: "(31)9 1111-1111",
    email: "dominik.szoboszlai@gmail.com",
    payment: "pix",
  },
  {
    name: "Diogo Jota",
    age: "27",
    level: "Fluent",
    phone: "(31)9 1010-1010",
    email: "diogo.jota@gmail.com",
    payment: "pix",
  },
  {
    name: "Luis Díaz",
    age: "27",
    level: "Fluent",
    phone: "(31)9 9090-9090",
    email: "luis.diaz@gmail.com",
    payment: "pix",
  },
  {
    name: "Darwin Núñez",
    age: "24",
    level: "Fluent",
    phone: "(31)9 8080-8080",
    email: "darwin.nunez@gmail.com",
    payment: "pix",
  },
];

function seedStudents(database) {
  return new Promise((resolve, reject) => {
    const insertStatement = database.prepare(
      "INSERT INTO students (name, age, level, phone, email, payment) VALUES (?, ?, ?, ?, ?, ?)"
    );

    database.serialize(() => {
      database.run("BEGIN TRANSACTION");

      studentsData.forEach((student) => {
        insertStatement.run(
          student.name,
          student.age,
          student.level,
          student.phone,
          student.email,
          student.payment
        );
      });

      database.run("COMMIT", (err) => {
        if (err) {
          console.error("Error seeding students data:", err);
          reject(err);
        } else {
          console.log("Students data seeded successfully");
          resolve();
        }
      });
    });

    insertStatement.finalize();
  });
}

let db = new sqlite3.Database("./database.sqlite");

seedStudents(db);

export { studentsData, seedStudents };
