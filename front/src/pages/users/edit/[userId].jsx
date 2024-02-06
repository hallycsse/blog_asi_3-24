import { useAppContext } from "@/components/AppContext"
import Button from "@/components/Button"
import FormField from "@/components/FormField"
import Page from "@/components/Page"
import api from "@/services/api"
import { XMarkIcon } from "@heroicons/react/24/solid"
import { AxiosError } from "axios"
import clsx from "clsx"
import { Form, Formik } from "formik"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  displayName: yup
    .string()
    .min(1)
    .max(20)
    .trim()
    .matches(/[^\n\r\u00a0]/)
    .label("Display Name"),
})

const EditUser = (props) => {
  const {
    router: {
      query: { userId },
    },
  } = props
  const {
    state: { session },
    setSession,
  } = useAppContext()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [searchedUser, setSearchedUser] = useState(null)
  const [errors, setErrors] = useState([])
  const [viewDelete, setViewDelete] = useState(false)
  const handleViewDelete = () => {
    setViewDelete(!viewDelete)
  }

  const handleDelete = useCallback(async () => {
    const {
      data: {
        result: [result],
      },
    } = await api.patch(`/users/delete/${userId}`)

    if (result) {
      localStorage.removeItem("session_jwt")
      setSession()
      router.push("/")
    }
  }, [router, setSession, userId])

  const handleSubmit = useCallback(
    async ({ displayName }) => {
      setErrors([])

      try {
        const {
          data: { result },
        } = await api.patch(`/users/${parseInt(userId)}`, {
          displayName,
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

  useEffect(() => {
    ;(async () => {
      if (userId) {
        const {
          data: {
            result: [result],
          },
        } = await api(`/users/${parseInt(userId)}`)

        setSearchedUser(result)
      }
    })()
  }, [userId])

  if (!searchedUser) {
    return (
      <Page>
        <h1>Loading</h1>
      </Page>
    )
  }

  if (!user) {
    return (
      <Page>
        <div className="flex flex-col justify-center items-center h-full gap-8">
          <div className="text-2xl w-4/5 text-center">
            You have to be connected to create a post
          </div>
          <div className="flex gap-1 text-xl">
            <span>Go to :</span>
            <Link href="/sign-in" className="underline text-[#51afa6]">
              Sign-In
            </Link>
          </div>
        </div>
      </Page>
    )
  }

  const initialValues = {
    displayName: searchedUser.displayName,
  }

  if (user) {
    if (user.id !== parseInt(userId) && user.role !== "ADMIN") {
      return (
        <Page>
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg">
              You cant modify account that is not yours.
            </p>
            <p className="text-lg">Please go back or return to home screen.</p>
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
          <Form className="flex flex-col gap-8">
            <FormField
              type="input"
              placeholder="Enter Display Name"
              name="displayName"
              label="Display Name"
              className="mx-auto mt-8 w-11/12"
            />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="mx-auto text-[#51afa6] rounded-lg border-2 border-[#51afa6] px-1.5 py-1 disabled:border-neutral-400 disabled:text-neutral-400"
            >
              Edit
            </Button>
          </Form>
        )}
      </Formik>
      {user.id === parseInt(userId) ? (
        <>
          <h2 className="w-11/12 text-center mx-auto mt-8">
            If you want to change your password follow the link below.
          </h2>
          <Link
            href={`/users/edit/changePassword/${userId}`}
            className="mt-4 mx-auto rounded-md py-1 px-2 bg-[#51afa6] text-white text-lg"
          >
            Change Password
          </Link>
        </>
      ) : (
        ""
      )}
      <h2 className="w-11/12 text-center mx-auto mt-8">
        If you want to delete your account click on the button below.
      </h2>
      <Button
        onClick={handleViewDelete}
        className="px-2 py-1 rounded-md mx-auto mt-4 bg-red-400 text-white text-lg"
      >
        Delete account
      </Button>
      <div
        className={`${
          viewDelete ? "" : "hidden"
        } absolute inset-0 flex flex-col justify-center items-center`}
      >
        <div className="bg-[#51afa6] px-4 py-2 text-white flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">🛑 Warning !</h2>
            <Button className="my-auto" onClick={handleViewDelete}>
              <XMarkIcon className="h-7 w-7 font-bold" />
            </Button>
          </div>
          <p className="text-lg">You are about to delete your account.</p>
          <p className="text-lg">Are you sure ?</p>
          <div className="flex justify-around mt-2">
            <Button
              className="bg-white text-[#51afa6] py-1 w-2/5 rounded-md"
              onClick={handleViewDelete}
            >
              No
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-400 text-white py-1 w-2/5 rounded-md"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default EditUser
