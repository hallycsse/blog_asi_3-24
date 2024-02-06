import { useRouter } from "next/router"
import Button from "@/components/Button"
import Link from "next/link"

const nav = [
  { name: "Home", path: "/posts" },
  { name: "Create Post", path: "/posts/create-post" },
  { name: "Research", path: "/research" },
]

const Nav = () => {
  const router = useRouter()

  return (
    <header className="hidden md:visible md:flex w-full flex-col bg-[#51afa6] ">
      <nav className="my-auto mr-4 flex">
        <ul
          className={`bg-[#51afa6] pb-2 md:static md:flex md:gap-3 md:pb-0 ml-auto`}
        >
          {nav.map((link) => (
            <li key={link.name} className="text-center md:mt-0">
              <Link href={link.path}>
                <Button
                  className={`w-11/12 rounded-lg border-2 border-white py-1 text-lg active:bg-[#51afa6] active:text-white
               ${
                 router.pathname === link.path
                   ? "md:bg-[#51afa6] md:text-white"
                   : "md:text-neutral-600"
               } md:py-auto md:h-full md:w-fit md:border-0 md:text-sm md:bg-[#51afa6] md:hover:text-white md:active:bg-[#51afa6] md:active:text-white`}
                >
                  {link.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Nav
