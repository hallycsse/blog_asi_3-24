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
import { useCallback, useEffect, useState } from "react"
import * as yup from "yup"

const initialValues = {
  actualPassword: "",
  newPassword: "",
}

const validationSchema = yup.object().shape({
  actualPassword: yup
    .string()
    .min(8)
    .matches(/\W/, "Password must contain at least a special character")
    .label("Password"),
  newPassword: yup
    .string()
    .min(8)
    .matches(/\W/, "Password must contain at least a special character")
    .label("Password"),
})

const ChangePassword = (props) => {
  const {
    router: {
      query: { userId },
    },
  } = props
  const {
    state: { session },
  } = useAppContext()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState([])

  const handleSubmit = useCallback(
    async ({ actualPassword, newPassword }) => {
      setErrors([])

      try {
        const {
          data: { result },
        } = await api.patch(`/users/edit/changePassword/${userId}`, {
          actualPassword,
          newPassword,
        })

        if (result[0]) {
          router.push(`/users/${userId}`)
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.error) {
          setErrors(err.response.data.error)

          return
        }

        setErrors(["Oops. Something went wrong, please try again."])
      }
    },
    [userId, router],
  )

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  if (user) {
    if (user.id !== parseInt(userId)) {
      return (
        <Page>
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg text-center">
              You cant modify a user password that is not yours.
            </p>
            <p className="text-lg">Please return back or go to home screen.</p>
            <Link
              className="px-2 py-1 bg-[#51afa6] rounded-md mx-auto text-white"
              href={"/"}
            >
              Home
            </Link>
          </div>
        </Page>
      )
    }
  }
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
          <Form className="flex flex-col gap-4">
            <FormField
              type="password"
              placeholder="Enter Actual Password"
              name="actualPassword"
              label="Actual Password"
              className="mx-auto mt-8 w-11/12"
            />
            <FormField
              type="password"
              placeholder="Enter New Password"
              name="newPassword"
              label="New Password"
              className="mx-auto w-11/12"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="mx-auto mt-4 text-[#51afa6] rounded-lg border-2 border-[#51afa6] px-1.5 py-1 disabled:border-neutral-400 disabled:text-neutral-400"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Page>
  )
}

export default ChangePassword
