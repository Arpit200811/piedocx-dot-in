import React from 'react'
import Slider from './Slider'
import Card from './Card'
import AboutUs from './Aboutus1'
import Aboutus2 from './Aboutus2'
import Counter from './Counter'
import TeamSection from './TeamSection'
import Project from './Project'
import Pricing from './Pricing'

function Home() {
  return (
    <>
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