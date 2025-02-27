import React from 'react'
import { Link } from 'react-router'
import { MdDashboard } from "react-icons/md";
import { FaBackward } from "react-icons/fa6";



export default function Header({page}) {
  return (
   <>
   <header className='md:grid grid-cols-3 hidden '>
        <h1 className="text-3xl font-bold mb-6 text-center col-start-2">{page?'Dashboard':'Task Manager'}</h1>
        <div className='text-right me-10 mt-3'>
          <Link to={page?'/':'/dashboard'} className='bg-orange-300 p-4 '>{page?'Back to Manage':'Dashboard'}</Link>
        </div>
      </header>

      <header className=' md:hidden '>
        <h1 className="text-3xl font-bold mb-6 text-center col-start-2">{page?'Dashboard':'Task Manager'}</h1>
          <Link to={page?'/':'/dashboard'}>
          {  page
            ?
            <FaBackward className='text-3xl text-orange-400' />

            :
            <MdDashboard className='text-3xl text-orange-400' />


          }
          </Link>
      </header>
   </>
  )
}
