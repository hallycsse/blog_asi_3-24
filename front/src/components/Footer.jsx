import { useAppContext } from "@/components/AppContext"
import {
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid"
import {
  UserPlusIcon as OutlinedUserPlusIcon,
  ChatBubbleBottomCenterIcon as OutlinedChatBubbleBottomCenterIcon,
  HeartIcon as OutlinedHeartIcon,
  HomeIcon as OutlinedHomeIcon,
  MagnifyingGlassIcon as OutlinedMagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import clsx from "clsx"

const Footer = () => {
  const router = useRouter()
  const {
    state: { session },
  } = useAppContext()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!session) {
      return
    }

    setUser(session.user)
  }, [session])

  return (
    <footer className="bg-[#51afa6] py-2 w-full md:hidden flex justify-evenly items-center text-white text-lg">
      <Link href="/">
        {router.pathname === "/" ? (
          <HomeIcon className="h-6 w-6" />
        ) : (
          <OutlinedHomeIcon className="w-6 h-6" />
        )}
      </Link>
      <Link href="/posts/create-post">
        {router.pathname === "/posts/create-post" ? (
          <ChatBubbleBottomCenterIcon className="h-6 w-6" />
        ) : (
          <OutlinedChatBubbleBottomCenterIcon className="w-6 h-6" />
        )}
      </Link>
      <Link href="/research">
        {router.pathname === "/research" ? (
          <MagnifyingGlassIcon className="h-6 w-6" />
        ) : (
          <OutlinedMagnifyingGlassIcon className="w-6 h-6" />
        )}
      </Link>
      {user ? (
        <Link href={`/users/${user.id}`}>
          <div className="h-6 w-6">
            <div
              className={clsx(
                "bg-gray-400 border-white rounded-full h-full items-center justify-center flex",
                router.pathname === `/users/${user.id}` ? "border-2" : "border",
              )}
            >
              <UserIcon className="text-white w-4 h-4" />
            </div>
          </div>
        </Link>
      ) : (
        <Link href="/sign-in">
          {router.pathname === "/sign-in" || router.pathname === "/sign-up" ? (
            <UserPlusIcon className="h-6 w-6" />
          ) : (
            <OutlinedUserPlusIcon className="w-6 h-6" />
          )}
        </Link>
      )}
    </footer>
  )
}

export default Footer
