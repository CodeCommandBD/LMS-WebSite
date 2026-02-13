import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router'
import CourseTab from './CourseTab'

const UpdateCourse = ({courseId}) => {
  return (
    <div className='md:p-10 p-4'>
        <div className='w-full bg-white flex items-center justify-between mb-5'>
            <h1 className='text-2xl font-bold'>Add details information of course</h1>
            <Link to={`/admin/courses/${courseId}/lectures`} className='text-white px-4 py-2 rounded-lg'>
               <Button className='cursor-pointer'>Go to lectures page</Button>
            </Link>
        </div>
        <CourseTab/>
    </div>
  )
}

export default UpdateCourse