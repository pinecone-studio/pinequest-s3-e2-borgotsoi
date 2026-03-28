export const subjectTypeDefs = /* GraphQL */ `
  type Subject {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Topic {
    id: ID!
    name: String!
    grade: Int!
    subjectId: ID!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    subjects: [Subject!]!
    topics(subjectId: ID!): [Topic!]!
  }

  extend type Mutation {
    createSubject(name: String!): Subject!
  }
`;
