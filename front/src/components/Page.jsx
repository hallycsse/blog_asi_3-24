import Footer from "@/components/Footer"
import Header from "./Header"

const Page = (props) => {
  const { children } = props

  return (
    <div className="h-screen flex flex-col w-full">
      <Header />
      <article className="grow overflow-y-auto flex flex-col w-full">
        {children}
      </article>
      <Footer />
    </div>
  )
}
export default Page
