'use client'
import React from 'react'
import Header from './components/TopBar'
import HeroCategoriesSection from './components/MidSection'
import MostPurchasedSection from './components/MostPurchased'
import Footer from './components/Footer'
import MostViewedSection from './components/MostViewed'
import TrendingFeedSection from './components/Trending'

const Home = () => {
  return (
    <div className="bg-white w-full h-full ">
      <Header />  
      <HeroCategoriesSection/>
      <MostPurchasedSection/>
      <MostViewedSection/>
      <TrendingFeedSection/>
      <Footer/>
    </div>

  )
}

export default Home