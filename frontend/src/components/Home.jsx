import React, { useEffect } from 'react'
import Slider from './Slider'
import Card from './Card'
import AboutUs from './Aboutus1'
import Aboutus2 from './Aboutus2'
import Counter from './Counter'
import TeamSection from './TeamSection'
import Project from './Project'
import Pricing from './Pricing'
import WorkingProcess from './HomeSub/WorkingProcess'
import Testimonials from './HomeSub/Testimonials'

import SEO from './SEO'

function Home() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
    <SEO 
      title="Piedocx - Web & App Development Company" 
      description="Piedocx Technologies offering top-notch web development, app development, and blockchain solutions. Transform your digital presence with our expert team."
    />
    <Slider/>
    <Card/>
    <AboutUs/>
    <WorkingProcess />
    <Aboutus2/>
    <Counter/>
    <Project/>
    <Testimonials />
    <TeamSection/>
    <Pricing/>
    </>
  )
}

export default Home