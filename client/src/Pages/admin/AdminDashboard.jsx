import AdminSideBar from '@/components/AdminSideBar'
import React from 'react'
import { Outlet } from 'react-router'

const AdminDashboard = () => {
  return (
    <div className='mt-20'>
      <div className='flex-1'>
        <AdminSideBar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminDashboard