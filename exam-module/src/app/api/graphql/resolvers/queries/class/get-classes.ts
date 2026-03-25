import { getDb } from "@/db";
import { classes as classesTable } from "@/db/schema";
import { QueryResolvers } from "@/gql/graphql";

export const getClasses: QueryResolvers["getClasses"] = async (
  _,
  __,
  context,
) => {
  const db = getDb(context.db);
  const classes = await db.select().from(classesTable);
  return classes;
};
