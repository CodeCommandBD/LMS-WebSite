import React from 'react'
import courses from '../data/courses.json'
import CourseCard from '@/components/CourseCard'

const Courses = () => {
  return (
    <div className='bg-gray-100 pt-20'>
      <div className='min-h-screen max-w-7xl mx-auto py-10'>
        <div className='px-4'>
          <h1 className='text-4xl font-bold text-center text-gray-800 mb-4'>Explore Our Courses</h1>
          <p className='text-center mb-12 text-gray-600'>Discover a wide range of courses taught by expert instructors.</p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {courses.map((course) => (
              <CourseCard course={course}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses