import { Outlet } from "react-router-dom"
import Header from "@/components/Landing/Header"
import Footer from "@/components/Landing/Footer"

export default function PublicLayout() {
    
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
