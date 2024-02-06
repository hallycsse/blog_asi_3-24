import { useAppContext } from "@/components/AppContext"
import Page from "@/components/Page"
import PostComment from "@/components/PostComment"
import api from "@/services/api"
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useEffect, useState } from "react"

let doing = false

const PostId = (props) => {
  const {
    router: {
      query: { postId },
    },
  } = props
  const {
    state: { session },
  } = useAppContext()
  const [user, setUser] = useState(null)

  const [searchedPost, setSearchedPost] = useState(null)
  const [views, setViews] = useState([])

  useEffect(() => {
    if (session) {
      setUser(session.user)
    }
  }, [session])

  useEffect(() => {
    ;(async () => {
      if (postId) {
        const {
          data: {
            result: [result],
            views: { views },
          },
        } = await api(`/posts/${parseInt(postId)}`)

        setSearchedPost(result)
        setViews(views)
      }
    })()
  }, [postId])

  useEffect(() => {
    ;(async () => {
      if (user && views && postId && searchedPost) {
        if (
          !views.includes(parseInt(user.id)) &&
          parseInt(user.id) !== parseInt(searchedPost.userId)
        ) {
          if (!doing) {
            doing = true
            const {
              data: {
                result: [result],
              },
            } = await api.patch(`/posts/addView/${parseInt(postId)}`, {
              userId: user.id,
            })
            doing = false
          }
        }
      }
    })()
  }, [postId, user, views, searchedPost])

  if (!searchedPost || !searchedPost.commentsUsers) {
    return <Page>Loading..</Page>
  }

  const date = new Date(searchedPost.createdAt)

  return (
    <Page>
      <div className="flex flex-col gap-4 mx-4">
        <div className="flex justify-between mt-4">
          <Link href={`/users/${searchedPost.users.id}`} className="flex gap-3">
            <div className="h-12 w-12">
              <div className="bg-gray-400 border border-white rounded-full h-full items-center justify-center flex">
                <UserIcon className="text-white w-8 h-8" />
              </div>
            </div>
            <div className="my-auto">
              <p className="font-bold">{searchedPost.users.displayName}</p>
              {searchedPost.users.role === "ADMIN" ? (
                <span className="text-sm text-gray-600 italic">Admin</span>
              ) : (
                ""
              )}
            </div>
          </Link>
          <div className="text-gray-500 my-auto">
            <div>
              {date.getHours()}:{date.getMinutes()}  {date.getDate()}-
              {date.getMonth()}-{date.getFullYear()}
            </div>
            <div className="flex justify-end">
              <EyeIcon className="w-5 h-5 my-auto mr-1" />
              {views.length}
            </div>
          </div>
        </div>
        <div className="text-xl">{searchedPost.title}</div>
        <div className="">{searchedPost.content}</div>
        {user && user.id === searchedPost.userId ? (
          <Link
            href={`/posts/edit/${searchedPost.id}`}
            className="bg-[#51afa6] mx-auto text-white px-2 py-1 rounded-md text-lg"
          >
            Edit Post
          </Link>
        ) : (
          ""
        )}
        <ul className="flex flex-col gap-3">
          {searchedPost.comments.map((comment, i) => {
            const commentWritter = searchedPost.commentsUsers.find(
              (e) => e.id === comment.userId,
            )
            const commentDate = new Date(comment.createdAt)

            return (
              <li key={i}>
                <Link
                  href={`/users/${commentWritter.id}`}
                  className="flex gap-3"
                >
                  <div className="h-8 w-8 my-auto">
                    <div className="bg-gray-400 border border-white rounded-full h-full items-center justify-center flex">
                      <UserIcon className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="my-auto flex flex-col">
                    <p className="font-semibold">
                      {commentWritter.state === "DELETED"
                        ? "DELETED USER"
                        : commentWritter.displayName}
                    </p>

                    {commentWritter.state !== "DELETED" &&
                    commentWritter.role === "ADMIN" ? (
                      <span className="italic text-sm text-gray-600">
                        Admin
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="text-gray-500 my-auto ml-auto">
                    {commentDate.getHours()}:{commentDate.getMinutes()}  
                    {commentDate.getDate()}-{commentDate.getMonth() + 1}-
                    {commentDate.getFullYear()}
                  </div>
                </Link>
                <div>{comment.content}</div>
              </li>
            )
          })}
        </ul>
        {user ? (
          <PostComment postId={postId} userId={user.id} />
        ) : (
          <div className="text-white text-center w-11/12 mx-auto bg-blue-300 rounded-md p-4 flex flex-col">
            ℹ️ In order to post a comment on this post you have to be connected.
            <Link href={"/sign-in"} className="underline w-fit mx-auto">
              Sign-in
            </Link>
          </div>
        )}
      </div>
    </Page>
  )
}

export default PostId
