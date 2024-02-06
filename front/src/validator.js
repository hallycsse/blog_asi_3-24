import * as yup from "yup"

export const pageValidator = yup.number().min(1).default(1).required()
