import Post from "../db/models/Post.js"
import validate from "../middlewares/validate.js"
import {
  pageValidator,
  validateContent,
  validateId,
  validatePostTitle,
} from "../validators.js"

const makePostsRoutes = ({ app }) => {
  app.post(
    "/posts",
    validate({
      body: {
        title: validatePostTitle.required(),
        content: validateContent.required(),
        userId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { title, content, userId } = req.body

      const post = await Post.query()
        .insert({ title, content, userId })
        .returning("*")

      res.send({ result: [post] })
    }
  )
  app.get(
    "/posts",
    validate({
      query: {
        page: pageValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        query: { page },
      } = req
      const query = Post.query()
      const posts = await query
        .clone()
        .withGraphFetched("users")
        .orderBy("createdAt", "DESC")
        .page(page)
      const [count] = await query.clone().count()

      res.send({ result: posts, count })
    }
  )
  app.get(
    "/posts/:postId",
    validate({
      params: {
        postId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { postId } = req.params
      const post = await Post.query()
        .findById(postId)
        .withGraphFetched("users")
        .withGraphFetched("commentsUsers")
        .withGraphFetched("comments")
      const views = JSON.parse(JSON.stringify(post.views))

      res.send({ result: [post], views })
    }
  )
  app.patch(
    "/posts/:postId",
    validate({
      params: { postId: validateId.required() },
      body: {
        title: validatePostTitle,
        content: validateContent,
      },
    }),
    async (req, res) => {
      const {
        params: { postId },
        body: { title, content },
      } = req

      const post = await Post.query().findById(postId).throwIfNotFound()

      if (!post) {
        res.status("404").send({ error: ["User not found."] })
      }

      const updatedPost = await post
        .$query()
        .update({ title, content })
        .returning("*")

      res.send({ result: [updatedPost] })
    }
  )
  app.patch(
    "/posts/addView/:postId",
    validate({
      params: { postId: validateId.required() },
      body: { userId: validateId.required() },
    }),
    async (req, res) => {
      const {
        body: { userId },
        params: { postId },
      } = req

      const post = await Post.query().findById(postId)

      if (!post) {
        res.status(404).send({ errors: ["Post Not Found"] })

        return
      }
      console.log("hehe")

      const updatedPost = await post
        .$query()
        .patch({
          views: JSON.stringify({ views: [...post.views.views, userId] }),
        })
        .returning("*")

      res.send({
        result: [updatedPost],
      })
    }
  )
}

export default makePostsRoutes
