export const classTypeDefs = `
  type Class {
    id: ID!
    name: String!
  }

  extend type Query {
    getClasses: [Class!]!
  }

  extend type Mutation {
    createClass(name: String!): Class!
  }
`;
