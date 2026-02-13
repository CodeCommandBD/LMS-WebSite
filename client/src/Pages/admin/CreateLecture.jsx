import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const CreateLecture = () => {
  return (
    <div className='p-4 md:p-6 h-screen bg-gray-50'>
        <h1 className='text-2xl font-bold mb-2'>Lectures</h1>
        <p className='text-gray-500 mb-6'>Add new lecture for course</p>
        <div className='mt-10 '>
            <form action="" className='space-y-5'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" placeholder='Enter lecture title' />
                </div>
                <div className='flex gap-2 '>
                    <Button variant='outline' className="cursor-pointer">Back to course</Button>
                    <Button className="cursor-pointer">Add Lecture</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateLecture