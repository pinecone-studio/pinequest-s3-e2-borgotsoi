export const sessionTypeDefs = `
  scalar Date

  type ExamSession {
    id: ID!
    examId: ID!
    classId: ID!
    exam: Exam     
    class: Class    
    startTime: Date!
    endTime: Date!
    status: String!
  }

  input CreateExamSessionInput {
    examId: ID!
    classId: ID!
    startTime: Date!
    endTime: Date!
  }

  extend type Query {
    getSessionsByClass(classId: ID!): [ExamSession!]!
    getActiveSessions: [ExamSession!]!
  }

  extend type Mutation {
    createExamSession(input: CreateExamSessionInput!): ExamSession!
  }
`;
