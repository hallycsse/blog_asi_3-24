import { useAppContext } from "@/components/AppContext"
import { ArrowLeftOnRectangleIcon, UserIcon } from "@heroicons/react/24/solid"
import { UserIcon as OutlinedUserIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const Status = ({ className }) => {
  const {
    state: { session },
    setSession,
  } = useAppContext()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const handleClick = () => {
    localStorage.removeItem("session_jwt")
    setSession()
    router.push("/")
    router.reload()
  }

  useEffect(() => {
    if (!session) {
      return
    }

    setUser(session.user)
  }, [session])

  return (
    <div className={`flex ${className} mr-4`}>
      <div className="flex my-auto">
        {user ? (
          <div className="flex grow">
            <button onClick={handleClick}>
              <ArrowLeftOnRectangleIcon className="text-white w-6 h-6 " />
            </button>
            <button className=" text-white w-24">
              <Link href={`/users/${user.id}`} className="">
                {user.displayName}
              </Link>
            </button>
          </div>
        ) : (
          <button className="text-3xl">
            {user ? (
              <Link href={`/users/${user.id}`}>{user.displayName}</Link>
            ) : (
              <Link href="/sign-in">
                {router.pathname === "/sign-in" ||
                router.pathname === "/sign-up" ? (
                  <UserIcon className="text-white w-6 h-6" />
                ) : (
                  <OutlinedUserIcon className="text-neutral-600 hover:text-white w-6 h-6" />
                )}
              </Link>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default Status
