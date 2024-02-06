import Page from "@/components/Page"
import api from "@/services/api"
import { UserIcon } from "@heroicons/react/24/solid"
import { Form, Formik } from "formik"
import Link from "next/link"
import { useEffect, useState } from "react"

const Research = () => {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState([])

  const handleInput = (event) => {
    setQuery(event.target.value)
  }

  useEffect(() => {
    ;(async () => {
      if (query) {
        const {
          data: { result },
        } = await api(`/searchUsers?query=${query}`)

        setUsers(result)
        return
      }
      setUsers([])
    })()
  }, [query])

  return (
    <Page>
      <div className="flex flex-col items-center w-full py-3">
        <input
          className="w-11/12 border border-gray-400 rounded-md px-4 py-2"
          placeholder="Search"
          onChange={handleInput}
        />
      </div>
      <ul className="flex flex-col items-center w-full gap-2 overflow-y-auto">
        {!users[0] && query === "" ? (
          <li className="text-center w-4/6 mx-auto text-lg mt-4">
            You can search users by typing in the area above.
          </li>
        ) : (
          ""
        )}
        {!users[0] && query !== "" ? (
          <li className="text-center w-4/6 mx-auto text-lg">
            No result found.
          </li>
        ) : (
          ""
        )}
        {users.map((user) => {
          if (user.state === "DELETED") {
            return
          }

          return (
            <Link key={user.id} href={`/users/${user.id}`} className="w-11/12">
              <li className="w-full bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex gap-3">
                  <div className="h-8 w-8 my-auto">
                    <div className="bg-gray-400 border border-white rounded-full h-full items-center justify-center flex">
                      <UserIcon className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="my-auto flex flex-col">
                    <p className="font-semibold">{user.displayName}</p>
                    {user.state !== "DELETED" && user.role === "ADMIN" ? (
                      <span className="italic text-sm text-gray-600">
                        Admin
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </li>
            </Link>
          )
        })}
      </ul>
    </Page>
  )
}

export default Research
