'use client'
import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import Header from '../components/TopBar';
import Head from 'next/head';
import ProductsGridComponent from '../components/ProductCards';
import Footer from '../components/Footer';
import SellRate from '../components/SellRate';

const HorizontalUserProfile: React.FC = () => {
  return(
    <div className='w-full'>
    <Header />
    <SellRate/>
    <ProductsGridComponent/>
    <Footer/>
    </div>
  );
};

export default HorizontalUserProfile;