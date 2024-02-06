import Button from "@/components/Button"
import FormField from "@/components/FormField"
import api from "@/services/api"
import { AxiosError } from "axios"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import * as yup from "yup"

const initialValue = {
  content: "",
}

const validationSchema = yup.object().shape({
  content: yup.string(),
})

const PostComment = ({ postId, userId }) => {
  const [errors, setErrors] = useState([])
  const router = useRouter()

  const handleComment = useCallback(
    async ({ content }) => {
      setErrors([])

      try {
        const {
          data: { result },
        } = await api.post("/comments", {
          content,
          postId: parseInt(postId),
          userId,
        })

        if (result[0]) {
          router.reload()
        }
      } catch (err) {
        if (err instanceof AxiosError && err.response?.data?.error) {
          setErrors(err.response.data.error)

          return
        }

        setErrors(["Oops. Something went wrong, please try again."])
      }
    },
    [postId, userId, router],
  )

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleComment}
    >
      {({ isSubmitting, isValid }) => (
        <Form className="flex flex-col gap-2">
          <FormField
            type="input"
            placeholder="Enter Comment"
            name="content"
            label="Comment"
            className="mx-auto w-11/12"
          />
          {errors
            ? errors.map((error, i) => (
                <span key={i} className="mx-auto">
                  {error}
                </span>
              ))
            : ""}
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="px-2 py-1 bg-[#51afa6] rounded-md text-white mx-auto"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default PostComment
