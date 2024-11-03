import sqlite3 from "sqlite3";

const classesData = [
  {
    
  },
];

function seedUsers(database) {
  return new Promise((resolve, reject) => {
    const insertStatement = database.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );

    database.serialize(() => {
      database.run("BEGIN TRANSACTION");
      
      database.run("DELETE FROM users");

      classesData.forEach((classItem) => {
        insertStatement.run(
          classItem.name,
          classItem.email,
          classItem.password
        );
      });

      database.run("COMMIT", (err) => {
        if (err) {
          console.error("Error seeding classes data:", err);
          reject(err);
        } else {
          console.log("Database cleared and classes data seeded successfully");
          resolve();
        }
      });
    });

    insertStatement.finalize();
  });
}

let db = new sqlite3.Database("./database.sqlite");

seedUsers(db);

export { classesData, seedUsers };
