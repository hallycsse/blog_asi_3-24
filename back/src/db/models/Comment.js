import Post from "./Post.js"
import User from "./User.js"
import BaseModel from "./BaseModel.js"

class Comment extends BaseModel {
  static tableName = "comments"

  static get relationMappings() {
    return {
      posts: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Post,
        join: {
          from: "comments.postId",
          to: "posts.id",
        },
      },
      users: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "comments.userId",
          to: "users.id",
        },
      },
    }
  }
}

export default Comment
