import { getDb } from "@/db";
import { classes } from "@/db/schema";
import { MutationResolvers } from "@/gql/graphql";

export const createClass: MutationResolvers["createClass"] = async (
  _,
  { name },
  context,
) => {
  const db = getDb(context.db);

  const [result] = await db
    .insert(classes)
    .values({
      name: name,
    })
    .returning();

  if (!result) throw new Error("Дата хадгалагдсангүй");
  return result;
};
