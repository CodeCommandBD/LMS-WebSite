import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from "@/components/ui/switch"

const EditLecture = () => {
    
  return (
    <div className="p-4 md:p-6 h-screen bg-gray-50">
        <div className='flex items-center gap-3 mb-5'>
            <div>
                <Link to="/admin/courses">
                    <Button variant="outline" type="button" className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <h1 className='text-2xl font-bold mb-2'>Update Your Lecture</h1>
        </div>
        <div className='bg-white rounded-xl p-6'>
            <form action="">
                <h2 className='text-xl font-bold '>Edit Lecture</h2>
                <p className='text-gray-500'>Make changes to your lecture</p>

                <Button variant="destructive" type="button" className="cursor-pointer text-white mt-4 p-2">
                    Remove Lecture
                </Button>
                <div className='mt-10 flex flex-col gap-3'>
                    <Label>Lecture Title</Label>
                    <Input type="text" placeholder="Enter lecture title" />
                </div>
                <div className='mt-10 flex flex-col gap-3'>
                    <Label>Lecture Video</Label>
                    <Input type="file" placeholder="Enter lecture title" />
                </div>
                <div className='mt-10 flex items-center gap-2'>
                    <Switch />
                    <Label>Is this video FREE</Label>
                </div>
                <div className='mt-10'>
                    <Button type="submit" className="cursor-pointer text-white mt-4 p-2">
                        Update Lecture
                    </Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditLecture