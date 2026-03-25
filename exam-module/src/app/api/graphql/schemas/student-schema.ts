export const studentTypeDefs = `#graphql
  type Student {
    id: ID!
    name: String!
    email: String
    classId: ID!
  }

  extend type Query {
  getStudents: [Student!]!
  }

  extend type Mutation {
    createStudent(name: String!, email: String, classId: ID!): Student!
  }
`;
