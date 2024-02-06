import Button from "@/components/Button"
import FormField from "@/components/FormField"
import Page from "@/components/Page"
import api from "@/services/api"
import { Form, Formik } from "formik"
import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import * as yup from "yup"
import { useAppContext } from "@/components/AppContext"
import clsx from "clsx"
import Link from "next/link"

const initialValues = {
  emailOrUsername: "",
  password: "",
}
const validationSchema = yup.object().shape({
  emailOrUsername: yup.string().min(2).trim().label("Email or Username"),
  password: yup
    .string()
    .min(8)
    .matches(/\W/, "Password must contain at least a special character")
    .label("Password"),
})

const SignIn = () => {
  const router = useRouter()
  const [errors, setErrors] = useState([])
  const { setSession } = useAppContext()
  const handleSubmit = useCallback(
    async ({ emailOrUsername, password }) => {
      setErrors([])

      try {
        const {
          data: {
            result: [{ jwt }],
          },
        } = await api.post("/sign-in", {
          emailOrUsername,
          password,
        })

        if (jwt) {
          setSession(jwt)

          router.push("/")

          return
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.error) {
          setErrors(err.response.data.error)

          return
        }

        setErrors(["Oops. Something went wrong, please try again."])
      }
    },
    [router, setSession],
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
              placeholder="Enter Email Or Username"
              name="emailOrUsername"
              label="Email or Username"
            />
            <FormField
              className="mx-auto w-3/4 sm:w-2/3"
              type="password"
              placeholder="Enter Password"
              name="password"
              label="Password"
            />
            <span className="mx-auto text-gray-400">
              No account already ?
              <Link
                className="text-[#51afa6] underline ml-1.5"
                href={"/sign-up"}
              >
                Sign-Up
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

SignIn.isPublic = true

export default SignIn
