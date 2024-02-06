import User from "./User.js"
import Comment from "./Comment.js"
import BaseModel from "./BaseModel.js"

class Post extends BaseModel {
  static tableName = "posts"

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "posts.userId",
          to: "users.id",
        },
      },
      comments: {
        relation: BaseModel.HasManyRelation,
        modelClass: Comment,
        join: {
          from: "posts.id",
          to: "comments.postId",
        },
      },
      commentsUsers: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "posts.id",
          through: {
            from: "comments.postId",
            to: "comments.userId",
          },
          to: "users.id",
        },
      },
    }
  }
}

export default Post
