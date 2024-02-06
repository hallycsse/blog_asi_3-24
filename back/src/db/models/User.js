import Post from "./Post.js"
import Comment from "./Comment.js"
import BaseModel from "./BaseModel.js"

class User extends BaseModel {
  static tableName = "users"

  static get relationMappings() {
    return {
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: Post,
        join: {
          from: "users.id",
          to: "posts.userId",
        },
      },
      comments: {
        relation: BaseModel.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "users.id",
          to: "comments.userId",
        },
      },
    }
  }
}

export default User
