import BaseQueryBuilder from "../BaseQueryBuilder.js"
import { Model } from "objection"

class BaseModel extends Model {
  static QueryBuilder = BaseQueryBuilder
}

export default BaseModel
