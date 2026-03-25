import { mergeTypeDefs } from "@graphql-tools/merge";
import { examTypeDefs } from "./exam-schema";
import { classTypeDefs } from "./class-schema";
import { studentTypeDefs } from "./student-schema";
import { sessionTypeDefs } from "./session";

export * from "./exam-schema";
export const typeDefs = mergeTypeDefs([
  examTypeDefs,
  classTypeDefs,
  studentTypeDefs,
  sessionTypeDefs,
]);
