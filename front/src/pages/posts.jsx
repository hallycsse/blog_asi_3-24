import Page from "@/components/Page"
import Pagination from "@/components/Pagination"
import config from "@/config"
import api from "@/services/api"
import { pageValidator } from "@/validator"
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useEffect, useState } from "react"

export const getServerSideProps = ({ query: { page } }) => ({
  props: {
    page: pageValidator.validateSync(page),
  },
})
const Posts = (props) => {
  const { page = 1 } = props
  const [Posts, setPosts] = useState([])
  const [Pages, setPages] = useState(1)

  useEffect(() => {
    ;(async () => {
      const {
        data: {
          result,
          count: { count },
        },
      } = await api(`/posts?${page ? `page=${page}` : ""}`)

      setPages(Math.ceil(count / config.pagination.limit))
      setPosts(result)
    })()
  }, [page])

  return (
    <Page>
      <ul className="flex flex-col items-center w-full h-screen gap-3 py-3">
        {Posts.sort((a, b) => b.createdAt - a.createdAt).map((post, i) => {
          const postDate = new Date(post.createdAt)

          return (
            <li key={i} className="w-11/12 bg-gray-100 rounded-lg px-3 py-2">
              <Link href={`/posts/${post.id}`}>
                <div className="flex gap-3">
                  <div className="h-8 w-8 my-auto">
                    <div className="bg-gray-400 border border-white rounded-full h-full items-center justify-center flex">
                      <UserIcon className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="my-auto flex flex-col">
                    <p className="font-semibold">
                      {post.users.state === "DELETED"
                        ? "DELETED USER"
                        : post.users.displayName}
                    </p>
                    {post.users.state !== "DELETED" &&
                    post.users.role === "ADMIN" ? (
                      <span className="italic text-sm text-gray-600">
                        Admin
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="text-gray-500 my-auto ml-auto text-sm">
                    <div>
                      {postDate.getHours() < 10
                        ? `0${postDate.getHours()}`
                        : `${postDate.getHours()}`}
                      :
                      {postDate.getMinutes() < 10
                        ? `0${postDate.getMinutes()}`
                        : `${postDate.getMinutes()}`}
                        
                      {postDate.getDate() < 10
                        ? `0${postDate.getDate()}`
                        : `${postDate.getDate()}`}
                      -
                      {postDate.getMonth() + 1 < 10
                        ? `0${postDate.getMonth() + 1}`
                        : `${postDate.getMonth() + 1}`}
                      -{postDate.getFullYear()}
                    </div>
                    <div className="flex justify-end">
                      <EyeIcon className="h-5 w-5 my-auto mr-1" />
                      {post.views.views.length}
                    </div>
                  </div>
                </div>
                <div className="text-lg">{post.title}</div>
                <div className="truncate text-gray-600 text-sm">
                  {post.content}
                </div>
              </Link>
            </li>
          )
        })}
        <Pagination page={page} pathname={"/posts"} countPages={Pages} />
      </ul>
    </Page>
  )
}

export default Posts
