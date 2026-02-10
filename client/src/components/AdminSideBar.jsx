import { BookOpen, ChartColumn } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'

const AdminSideBar = () => {
  return (
    <div className='w-80 bg-gray-800 text-white h-screen hidden md:block sticky top-20'>
        <div className='p-4'>
            <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        </div>
       <div className='pt-10 px-3 space-y-2'>
        <NavLink to="/admin/dashboard" className={({isActive}) => `text-xl block p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"} flex items-center cursor-pointer font-semibold gap-2 w-full `}>
        <ChartColumn/>
        Dashboard</NavLink>

        <NavLink to="/admin/courses" className={({isActive}) => `text-xl block p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"} flex items-center cursor-pointer font-semibold gap-2 w-full `}>
          <BookOpen/>
          Courses</NavLink>
       </div>
    </div>
  )
}

export default AdminSideBar