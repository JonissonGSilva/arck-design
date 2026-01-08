import Hero from '../components/sections/Hero'
import Features from '../components/sections/Features'
import FeaturesList from '../components/sections/FeaturesList'
import HowItWorks from '../components/sections/HowItWorks'
import FeaturedProjects from '../components/sections/FeaturedProjects'
import Community from '../components/sections/Community'
import CTA from '../components/sections/CTA'

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <FeaturesList />
      <HowItWorks />
      <FeaturedProjects />
      <Community />
      <CTA />
    </>
  )
}

export default Home

