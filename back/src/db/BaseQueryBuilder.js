import { QueryBuilder } from "objection"
import config from "../config.js"

class BaseQueryBuilder extends QueryBuilder {
  page(page) {
    return this.limit(config.pagination.limit).offset(
      (page - 1) * config.pagination.limit
    )
  }
}

export default BaseQueryBuilder
