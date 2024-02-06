export const up = async (knex) => {
  await knex.schema.alterTable("posts", (table) => {
    table.json("views").defaultTo(`{"views":[]}`)
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("posts", (table) => {
    table.dropColumn("views")
  })
}
