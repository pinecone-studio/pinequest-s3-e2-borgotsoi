export const sessionTypeDefs = `
  type ExamSession {
    id: ID!
    examId: ID!
    classId: ID!
    exam: Exam     
    class: Class    
    description: String!
    startTime: String!
    endTime: String!
    status: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateExamSessionInput {
    examId: ID!
    classId: ID!
    description: String!
    startTime: String!
    endTime: String!
  }

  type StudentExamSessionStatus {
    isStarted: Boolean!
    isFinished: Boolean!
  }

  extend type Query {
    getSessionsByClass(classId: ID!): [ExamSession!]!
    getActiveSessions: [ExamSession!]!
    examSession(id: ID!): ExamSession
    """
    Per-student progress for an exam session. Null if the student is not in that session's class.
    """
    studentExamSessionStatus(
      sessionId: ID!
      studentId: ID!
    ): StudentExamSessionStatus
  }

  extend type Mutation {
    createExamSession(input: CreateExamSessionInput!): ExamSession!
    """
    Marks the student's session as started when they open the active exam link.
    Idempotent. Creates a status row if missing (e.g. legacy sessions).
    """
    markStudentExamSessionStarted(sessionId: ID!, studentId: ID!): Boolean!
    updateExamSession(
      id: ID!
      examId: ID
      classId: ID
      description: String
      startTime: String
      endTime: String
    ): ExamSession!
    deleteExamSession(id: ID!): Boolean!
  }
`;
