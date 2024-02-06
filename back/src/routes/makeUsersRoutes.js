import checkPassword from "../checkPassword.js"
import { randomBytes } from "crypto"
import User from "../db/models/User.js"
import hashPassword from "../hashPassword.js"
import validate from "../middlewares/validate.js"
import {
  validateDisplayName,
  validateEmail,
  validateId,
  validatePassword,
  validateUsername,
} from "../validators.js"

const makeUsersRoutes = ({ app }) => {
  app.post(
    "/users",
    validate({
      body: {
        email: validateEmail.required(),
        username: validateUsername.required(),
        displayName: validateDisplayName.required(),
        password: validatePassword.required(),
      },
    }),
    async (req, res) => {
      const { email, username, displayName, password } = req.body
      const [passwordHash, passwordSalt] = hashPassword(password)

      const dupeEmail = await User.query().where({ email })

      if (dupeEmail) {
        res.status(409).send({ error: ["Duplicate entry for email"] })
      }

      const user = await User.query()
        .insert({
          email,
          username,
          displayName,
          passwordHash,
          passwordSalt,
        })
        .returning("*")

      res.send({ result: [user], count: 1 })
    }
  )
  app.get(
    "/users",
    validate({
      query: {},
    }),
    async (req, res) => {
      const { limit, offset } = req.query
      const users = await User.query().limit(limit).offset(offset)
      const [{ count }] = await User.query().count()

      res.send({ result: users, count })
    }
  )
  app.get(
    "/users/:userId",
    validate({
      params: {
        userId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { userId } = req.params
      const user = await User.query()
        .findById(userId)
        .withGraphFetched("posts")
        .withGraphFetched("comments")

      res.send({ result: [user] })
    }
  )
  app.get("/searchUsers", async (req, res) => {
    const { query } = req.query
    const users = await User.query()
      .whereILike("displayName", `%${query}%`)
      .returning("*")
    const count = await User.query()
      .whereILike("displayName", `%${query}%`)
      .count()

    res.send({ result: users, count: count })
  })
  app.patch(
    "/users/:userId",
    validate({
      body: { displayName: validateDisplayName.required() },
      params: { userId: validateId.required() },
    }),
    async (req, res) => {
      const {
        body: { displayName },
        params: { userId },
      } = req

      const updatedUser = await User.query()
        .findById(userId)
        .patch({ displayName })

      res.send({ result: [updatedUser] })
    }
  )
  app.patch(
    "/users/edit/changePassword/:userId",
    validate({
      params: { userId: validateId.required() },
      body: {
        actualPassword: validatePassword.required(),
        newPassword: validatePassword.required(),
      },
    }),
    async (req, res) => {
      const {
        body: { actualPassword, newPassword },
        params: { userId },
      } = req

      const user = await User.query().findById(userId)

      if (
        !(
          checkPassword(actualPassword, user.passwordSalt) === user.passwordHash
        )
      ) {
        res.status(403).send({ error: ["Password missmatch"] })
        return
      }
      const [passwordHash, passwordSalt] = hashPassword(newPassword)

      const updatedUser = await User.query()
        .findById(userId)
        .update({ passwordHash, passwordSalt })
        .returning("*")

      res.send({ result: [updatedUser], count: 1 })
    }
  )
  app.patch(
    "/users/delete/:userId",
    validate({
      params: {
        userId: validateId.required(),
      },
    }),
    async (req, res) => {
      const { userId } = req.params

      const user = await User.query()
        .findById(userId)
        .update({
          state: "DELETED",
        })
        .throwIfNotFound()

      res.send({ result: [user], count: 1 })
    }
  )
}

export default makeUsersRoutes
