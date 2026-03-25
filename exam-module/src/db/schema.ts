import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

// 1. The main Exam table
export const exams = sqliteTable("exams", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: text("title").notNull(),
  description: text("description"),
  classId: text("class_id").references(() => classes.id), // add classId
  durationMinutes: integer("duration_minutes").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// 2. Questions linked to an exam
export const questions = sqliteTable("questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  examId: text("exam_id").references(() => exams.id),
  content: text("content").notNull(), // The question text
  correctAnswer: text("correct_answer").notNull(),
});

// 3. Proctoring Logs (To catch tab switching or AI usage)
export const proctorLogs = sqliteTable("proctor_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  examId: text("exam_id").references(() => exams.id),
  studentId: text("student_id").notNull(),
  eventType: text("event_type").notNull(), // e.g., 'TAB_SWITCH' or 'FOCUS_LOST'
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

export const classes = sqliteTable("classes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
});
export const students = sqliteTable("students", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  classId: text("class_id").references(() => classes.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const examSessions = sqliteTable("exam_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id),
  classId: text("class_id")
    .notNull()
    .references(() => classes.id),
  startTime: integer("start_time", { mode: "timestamp" }).notNull(),
  endTime: integer("end_time", { mode: "timestamp" }).notNull(),
  status: text("status").$default(() => "scheduled"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

