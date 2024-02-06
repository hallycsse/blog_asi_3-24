export const up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.text("state")
    table.text("role")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("role")
    table.dropColumn("state")
  })
}
