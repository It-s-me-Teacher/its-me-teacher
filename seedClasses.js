import sqlite3 from "sqlite3";

const classesData = [
  {
    title: "English Vocab 1",
    date: "2023-03-01",
    theme: "Basic Vocabulary",
    skills: ["Listening", "Speaking"],
  },
  {
    title: "English Vocab 2",
    date: "2023-03-05",
    theme: "Intermediate Vocabulary",
    skills: ["Reading", "Writing"],
  },
  {
    title: "English Vocab 3",
    date: "2023-03-10",
    theme: "Advanced Vocabulary",
    skills: ["Listening", "Reading", "Writing"],
  },
  {
    title: "English Vocab 4",
    date: "2023-03-15",
    theme: "Everyday Expressions",
    skills: ["Speaking", "Listening"],
  },
  {
    title: "English Vocab 5",
    date: "2023-03-20",
    theme: "Academic Vocabulary",
    skills: ["Reading", "Writing"],
  },
  {
    title: "English Vocab 6",
    date: "2023-03-25",
    theme: "Business Vocabulary",
    skills: ["Writing", "Speaking"],
  },
  {
    title: "English Vocab 7",
    date: "2023-03-30",
    theme: "Slang and Idioms",
    skills: ["Listening", "Speaking"],
  },
  {
    title: "English Vocab 8",
    date: "2023-04-05",
    theme: "Technical Vocabulary",
    skills: ["Reading", "Writing"],
  },
  {
    title: "English Vocab 9",
    date: "2023-04-10",
    theme: "Travel Vocabulary",
    skills: ["Speaking", "Listening", "Reading"],
  },
];

function seedClasses(database) {
  return new Promise((resolve, reject) => {
    const insertStatement = database.prepare(
      "INSERT INTO classes (title, date, theme, skills) VALUES (?, ?, ?, ?)"
    );

    database.serialize(() => {
      database.run("BEGIN TRANSACTION");

      classesData.forEach((classItem) => {
        insertStatement.run(
          classItem.title,
          classItem.date,
          classItem.theme,
          JSON.stringify(classItem.skills)
        );
      });

      database.run("COMMIT", (err) => {
        if (err) {
          console.error("Error seeding classes data:", err);
          reject(err);
        } else {
          console.log("Classes data seeded successfully");
          resolve();
        }
      });
    });

    insertStatement.finalize();
  });
}

let db = new sqlite3.Database("./database.sqlite");

seedClasses(db);

export { classesData, seedClasses };
