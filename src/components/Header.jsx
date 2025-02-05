'use client'
import React, { useEffect, useState } from 'react'
import { ShoppingCart, User } from 'lucide-react'
import { useGlobalContext } from '@/app/context/GlobalState'
import Link from 'next/link'
import BottomNav from './BottomNav'

const Header = () => {
const {count,setCount} = useGlobalContext()
useEffect(()=>{
    const products = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCount(products.length);

},[])

  return (
    <header className="flex justify-between items-center absolute top-0 left-0 right-0 p-4 bg-transparent z-10">
      <div className="w-16"></div>
      <div className="text-xl font-bold">
        
      </div>
      <div className="flex items-center space-x-4">

     
        <figure className='w-full max-w-[10vw]'>
          <img src="/logo/ru.png" className='w-full' alt="" />
        </figure>
      </div>

      <BottomNav />
    </header>
  )
}

export default Header