import hashPassword from "./hashPassword.js"

const checkPassword = (password, passwordSalt) => {
  const [passwordHash] = hashPassword(password, passwordSalt)

  return passwordHash
}

export default checkPassword
