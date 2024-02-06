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

const initialValues = { title: "", content: "" }

const validationSchema = yup.object().shape({
  title: yup.string(),
  content: yup.string(),
})

const EditPost = (props) => {
  const router = useRouter()
  const {
    router: {
      query: { postId },
    },
  } = props
  const {
    state: { session },
  } = useAppContext()
  const [errors, setErrors] = useState([])
  const [user, setUser] = useState(null)

  const [searchedPost, setSearchedPost] = useState(null)

  const handleSubmit = useCallback(
    async ({ title, content }) => {
      setErrors([])

      try {
        const {
          data: { result },
        } = await api.patch(`/posts/${postId}`, {
          title,
          content,
        })

        if (result[0]) {
          router.push(`/posts/${result[0].id}`)
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.error) {
          setErrors(err.response.data.error)

          return
        }

        setErrors(["Oops. Something went wrong, please try again."])
      }
    },
    [postId, router],
  )

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  useEffect(() => {
    ;(async () => {
      if (!postId) {
        return
      }
      const {
        data: {
          result: [result],
        },
      } = await api(`/posts/${parseInt(postId)}`)

      setSearchedPost(result)
      initialValues.content = result.content
      initialValues.title = result.title
    })()
  }, [postId])

  if (user && searchedPost) {
    if (user.id !== searchedPost.userId) {
      return (
        <Page>
          <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-lg">You cant modify a post that is not yours.</p>
            <p className="text-lg">Please return to back or to home screen.</p>
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
              placeholder="Enter Title"
              name="title"
              label="Title"
              className="mx-auto mt-8 w-11/12"
            />
            <FormField
              type="input"
              placeholder="Enter Content"
              name="content"
              label="Content"
              className="mx-auto w-11/12"
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
    </Page>
  )
}

export default EditPost
