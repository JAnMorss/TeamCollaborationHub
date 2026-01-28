import About from "@/components/Landing/About"
import Contact from "@/components/Landing/Contact"
import CTA from "@/components/Landing/CTA"
import Features from "@/components/Landing/Features"
import Hero from "@/components/Landing/Hero"

type Props = {}

export default function LandingPage({}: Props) {
  return (
    <div>
      <Hero />
      <Features />
      <About />
      <Contact />
      <CTA />
    </div>
  )
}