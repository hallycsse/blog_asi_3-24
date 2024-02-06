import { useAppContext } from "@/components/AppContext"
import Button from "@/components/Button"
import FormField from "@/components/FormField"
import Page from "@/components/Page"
import api from "@/services/api"
import { AxiosError } from "axios"
import clsx from "clsx"
import { Form, Formik } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import * as yup from "yup"

const initialValues = {
  email: "",
  username: "",
  displayName: "",
  password: "",
}
const validationSchema = yup.object().shape({
  email: yup.string().email().label("Email"),
  username: yup
    .string()
    .min(2)
    .max(15)
    .matches(
      /^[a-z][a-z0-9._]*/,
      "Username must contain only letters, numbers, '.' and '_'",
    )
    .trim()
    .label("Username"),
  displayName: yup
    .string()
    .min(1)
    .max(20)
    .trim()
    .matches(/[^\n\r\u00a0]/)
    .label("Display Name"),
  password: yup
    .string()
    .min(8)
    .matches(/\W/, "Password must contain at least a special character")
    .label("Password"),
})

const SignUp = () => {
  const router = useRouter()
  const [errors, setErrors] = useState([])
  const handleSubmit = useCallback(
    async ({ email, username, displayName, password }) => {
      setErrors([])

      try {
        const {
          data: { result },
        } = await api.post("/users", {
          email,
          username,
          displayName,
          password,
        })

        if (result) {
          router.push("/sign-in")
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.error) {
          setErrors(err.response.data.error)

          return
        }

        setErrors(["Oops. Something went wrong, please try again."])
      }
    },
    [router],
  )

  return (
    <Page>
      <ul
        className={clsx(
          `mx-auto mt-4 w-1/2 rounded-lg border-2 border-red-600 bg-red-500/30`,
          ` ${errors[0] ? "" : "hidden"}`,
        )}
      >
        {errors.map((error, i) => (
          <li key={i} className="p-1 text-center">
            🛑 {error}
          </li>
        ))}
      </ul>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-8" noValidate>
            <FormField
              className="mx-auto mt-8 w-3/4 sm:w-2/3"
              type="email"
              placeholder="Enter Email"
              name="email"
              label="Email"
            />
            <FormField
              className="mx-auto w-3/4 sm:w-2/3"
              type="text"
              placeholder="Enter Username"
              name="username"
              label="Username"
            />
            <FormField
              className="mx-auto w-3/4 sm:w-2/3"
              type="text"
              placeholder="Enter Display Name"
              name="displayName"
              label="Display Name"
            />
            <FormField
              className="mx-auto w-3/4 sm:w-2/3"
              type="password"
              placeholder="Enter Password"
              name="password"
              label="Password"
            />
            <span className="mx-auto text-gray-400">
              Already have an account ?
              <Link
                className="text-[#51afa6] underline ml-1.5"
                href={"/sign-in"}
              >
                Sign-In
              </Link>
            </span>
            <Button
              className="mx-auto text-[#51afa6] rounded-lg border-2 border-[#51afa6] px-1.5 py-1 disabled:border-neutral-400 disabled:text-neutral-400"
              type="submit"
              disabled={isSubmitting || !isValid}
            >
              SUBMIT
            </Button>
          </Form>
        )}
      </Formik>
    </Page>
  )
}

export default SignUp
