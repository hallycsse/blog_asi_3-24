import Link from "next/link"
import Nav from "./Nav"
import Status from "./Status"

const Header = () => {
  return (
    <header className="flex bg-[#51afa6] w-full">
      <Link
        href={"/"}
        className="text-white text-2xl py-1.5 ml-4 font-bold italic"
      >
        BLOG
      </Link>
      <Nav />
      <Status className="hidden md:flex" />
    </header>
  )
}
export default Header
