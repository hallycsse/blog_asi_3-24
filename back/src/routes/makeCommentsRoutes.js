import Comment from "../db/models/Comment.js"
import Post from "../db/models/Post.js"
import validate from "../middlewares/validate.js"
import { validateContent, validateId } from "../validators.js"

const makeCommentsRoutes = ({ app }) => {
  app.post(
    "/comments",
    validate({
      body: {
        content: validateContent.required(),
        userId: validateId.required(),
        postId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { content, userId, postId } = req.body

      const comment = await Comment.query()
        .insert({ content, userId, postId })
        .returning("*")

      res.send({ result: [comment] })
    }
  )
  app.get(
    "/comments/:commentId",
    validate({
      params: {
        commentId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { commentId } = req.params
      const comment = await Comment.query().findById(commentId)

      res.send({ result: [comment] })
    }
  )
}

export default makeCommentsRoutes
