import About from "./components/Landing/About"
import Contact from "./components/Landing/Contact"
import Features from "./components/Landing/Features"
import Footer from "./components/Landing/Footer"
import Header from "./components/Landing/Header"
import Hero from "./components/Landing/Hero"

function App() {

  return (
    <>
      <div className="dark">
        <Header />
        <Hero />
        <Features />
        <About />
        <Contact />
        <Footer />
      </div>
    </>
  )
}

export default App
