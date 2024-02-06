import { useAppContext } from "@/components/AppContext"
import Button from "@/components/Button"
import Page from "@/components/Page"
import api from "@/services/api"
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline"
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const UserPage = (props) => {
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
  const [openedSection, setOpenedSection] = useState("posts")
  const handleChangeOpenedSection = (event) => {
    const section = event.currentTarget.getAttribute("data-section-name")

    setOpenedSection(section)
  }
  const [user, setUser] = useState(null)
  const [ownUserPage, setOwnUserPage] = useState(false)
  const handleLogOut = () => {
    localStorage.removeItem("session_jwt")
    setSession()
    router.push("/")
  }
  const [searchedUser, setSearchedUser] = useState(null)

  useEffect(() => {
    if (session) {
      if (session.user.id === parseInt(userId)) {
        setOwnUserPage(true)
      }
      setUser(session.user)
    }
  }, [session, setOwnUserPage, userId])

  useEffect(() => {
    ;(async () => {
      if (!userId) {
        return
      }
      const {
        data: {
          result: [result],
        },
      } = await api(`/users/${parseInt(userId)}`)

      setSearchedUser(result)
    })()
  }, [userId])

  if (!searchedUser) {
    return <Page></Page>
  }

  if (searchedUser.state === "DELETED" && user.role !== "ADMIN") {
    return (
      <Page>
        <div className="flex flex-col justify-center items-center w-full h-screen gap-3">
          <h2 className="text-lg">This user has been deleted</h2>
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

  return (
    <Page>
      <div className="flex mx-4 mt-4">
        <div className="h-24 w-24">
          <div className="bg-gray-400 border border-white rounded-full h-full items-center justify-center flex">
            <UserIcon className="text-white w-14 h-14" />
          </div>
        </div>
        <div className="my-auto">
          <h1 className=" ml-4 text-xl font-bold">
            {searchedUser.displayName}
          </h1>
          {searchedUser.role === "ADMIN" ? (
            <h2 className="ml-4 text-gray-600 italic">Admin</h2>
          ) : (
            ""
          )}
        </div>
        {ownUserPage || user?.role === "ADMIN" ? (
          <Link
            href={`/users/edit/${userId}`}
            className="ml-auto py-1 px-2 rounded-md text-white bg-[#51afa6] h-fit my-auto"
          >
            Edit
          </Link>
        ) : (
          ""
        )}
      </div>
      <button
        className={clsx(
          "flex absolute top-1 right-1 text-white bg-red-400 rounded-sm py-1.5 px-1.5 gap-1 h-fit md:hidden",
          ownUserPage === true ? "" : "hidden",
        )}
        onClick={handleLogOut}
      >
        <span>Log-out</span>
        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
      </button>
      <div className="flex mx-auto mt-4 gap-2">
        <button
          onClick={handleChangeOpenedSection}
          data-section-name="posts"
          className={clsx(
            "font-semibold px-2 py-1 rounded-t-lg",
            openedSection === "posts" ? "bg-neutral-100" : "",
          )}
        >
          Posts: {searchedUser.posts.length}
        </button>
        <button
          onClick={handleChangeOpenedSection}
          data-section-name="comments"
          className={clsx(
            "font-semibold px-2 py-1 rounded-t-lg",
            openedSection === "comments" ? "bg-neutral-100" : "",
          )}
        >
          Comments: {searchedUser.comments.length}
        </button>
      </div>
      <ul
        className={clsx(
          "grow bg-neutral-100 flex flex-col pt-2 gap-3 overflow-y-auto items-center w-full",
          openedSection === "posts" ? "" : "hidden",
        )}
      >
        {!searchedUser.posts[0] ? (
          <li className="ml-4 text-lg">No Posts Yet</li>
        ) : (
          searchedUser.posts
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
            .map((post, i) => {
              const date = new Date(post.createdAt)

              return (
                <Link key={i} href={`/posts/${post.id}`} className="w-11/12">
                  <li className="flex flex-col gap-1 bg-white rounded-md py-2">
                    <div className="flex w-full">
                      <div className="truncate ml-4 text-lg hover:underline w-3/6 my-auto">
                        {post.title}
                      </div>

                      <div className="ml-auto mr-4 text-gray-500 text-sm">
                        <div>
                          {date.getHours() < 10
                            ? `0${date.getHours()}`
                            : `${date.getHours()}`}
                          :
                          {date.getMinutes() < 10
                            ? `0${date.getMinutes()}`
                            : `${date.getMinutes()}`}
                            
                          {date.getDate() < 10
                            ? `0${date.getDate()}`
                            : `${date.getDate()}`}
                          -
                          {date.getMonth() + 1 < 10
                            ? `0${date.getMonth() + 1}`
                            : `${date.getMonth() + 1}`}
                          -{date.getFullYear()}
                        </div>
                        <div className="flex justify-end">
                          <EyeIcon className="h-4 w-4 my-auto mr-1" />
                          {post.views.views.length}
                        </div>
                      </div>
                    </div>
                    <div className="truncate mx-4 text-gray-600">
                      {post.content}
                    </div>
                  </li>
                </Link>
              )
            })
        )}
      </ul>
      <ul
        className={clsx(
          "grow bg-neutral-100 pt-2 gap-3 flex flex-col items-center w-full",
          openedSection === "comments" ? "" : "hidden",
        )}
      >
        {!searchedUser.comments[0] ? (
          <li className="ml-4 text-lg">No Comments Yet</li>
        ) : (
          searchedUser.comments
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt)
            })
            .map((comment, i) => {
              const date = new Date(comment.createdAt)

              return (
                <Link
                  key={i}
                  href={`/posts/${comment.postId}`}
                  className="w-11/12"
                >
                  <li className="flex flex-col gap-1 rounded-md w-full bg-white py-2">
                    <div className="ml-auto mr-4 text-gray-500 text-sm">
                      {date.getHours() < 10
                        ? `0${date.getHours()}`
                        : `${date.getHours()}`}
                      :
                      {date.getMinutes() < 10
                        ? `0${date.getMinutes()}`
                        : `${date.getMinutes()}`}
                        
                      {date.getDate() < 10
                        ? `0${date.getDate()}`
                        : `${date.getDate()}`}
                      -
                      {date.getMonth() + 1 < 10
                        ? `0${date.getMonth() + 1}`
                        : `${date.getMonth() + 1}`}
                      -{date.getFullYear()}
                    </div>
                    <div className="truncate mx-4">{comment.content}</div>
                  </li>
                </Link>
              )
            })
        )}
      </ul>
    </Page>
  )
}

export default UserPage
