import * as yup from "yup"
import config from "./config.js"

export const validateEmail = yup.string().email().trim().label("E-mail")

export const validatePassword = yup
  .string()
  .min(8)
  .matches(/\W/, "Password must contain at least a special character")
  .label("Password")

export const validateUsername = yup
  .string()
  .min(2)
  .max(15)
  .matches(
    /^[a-z][a-z0-9._]*/,
    "Username must contain only letters, numbers, '.' and '_'"
  )
  .trim()
  .label("Username")

export const validateDisplayName = yup
  .string()
  .min(1)
  .max(20)
  .trim()
  .matches(/[^\n\r\u00a0]/)
  .label("Display Name")

export const validateId = yup.number().integer().min(1).label("ID")

export const validateEmailOrUsername = yup
  .string()
  .min(2)
  .trim()
  .label("Email or Username")

export const validateContent = yup.string().min(1).label("Content")

export const validatePostTitle = yup.string().min(1).label("Title")

export const pageValidator = yup.number().min(1).default(1).required()
