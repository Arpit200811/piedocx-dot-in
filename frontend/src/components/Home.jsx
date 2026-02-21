import React from 'react'
import Slider from './Slider'
import Card from './Card'
import AboutUs from './Aboutus1'
import Aboutus2 from './Aboutus2'
import Counter from './Counter'
import TeamSection from './TeamSection'
import Project from './Project'
import Pricing from './Pricing'

import SEO from './SEO'

function Home() {
  return (
    <>
    <SEO 
      title="Piedocx - Web & App Development Company" 
      description="Piedocx Technologies offering top-notch web development, app development, and blockchain solutions. Transform your digital presence with our expert team."
    />
    <Slider/>
    <Card/>
    <AboutUs/>
    <Aboutus2/>
    <Counter/>
    {/* <TeamSection/> */}
    {/* <Project/> */}
    <Pricing/>
    </>
  )
}

export default Home