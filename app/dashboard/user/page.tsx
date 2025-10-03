'use client'
import Footer from '@/app/components/Footer'
import VerticalNavMenu from '@/app/components/SidebarNavigation'
import Header from '@/app/components/TopBar'
import WalletDashboardComponent from '@/app/components/WalletDashboard'
import React from 'react'

const User = () => {
  return (
    <div className='w-full'>
        <Header/>
        
        <div className='flex w-full sm:w-[90%] m-auto justify-between'>
        <VerticalNavMenu/>
        <WalletDashboardComponent/>
        </div>
        <Footer/>
    </div>
  )
}

export default User