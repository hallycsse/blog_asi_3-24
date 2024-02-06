export const up = async (knex) => {
  await knex.schema.createTable("posts", (table) => {
    table.increments("id")
    table.integer("userId").references("id").inTable("users").notNullable()
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true, true)
  })
  await knex.schema.createTable("comments", (table) => {
    table.increments("id")
    table.integer("userId").references("id").inTable("users").notNullable()
    table.integer("postId").references("id").inTable("posts").notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("comments")
  await knex.schema.dropTable("posts")
}
