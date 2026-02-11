import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'





const CreateCourse = () => {
    
  return (
    <div className='md:p-10 p-4 w-full h-screen bg-gray-50'>
        <h1 className='text-2xl font-bold'>Lets Create a Course</h1>
        <p className='text-gray-500'>Fill up the form below to create a course</p>
        <form className='flex flex-col gap-3 mt-10'>
            <Label className='text-lg font-semibold'>Title</Label>    
            <Input type="text" placeholder="Your Course Title" />
            <div className='w-1/2 flex flex-col gap-3'>
            <Label className='text-lg font-semibold'>Category</Label>
            <Select className=''>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className='bg-white text-black h-40 overflow-y-auto'>
                    <SelectItem value="category1">Next js</SelectItem>
                    <SelectItem value="category2">React js</SelectItem>
                    <SelectItem value="category3">Node js</SelectItem>
                    <SelectItem value="category4"> JavaScript</SelectItem>
                    <SelectItem value="category5"> Python</SelectItem>
                    <SelectItem value="category6"> Java</SelectItem>
                    <SelectItem value="category7"> C++</SelectItem>
                    <SelectItem value="category8"> C#</SelectItem>
                    <SelectItem value="category9"> C</SelectItem>
                    <SelectItem value="category10"> HTML</SelectItem>
                    <SelectItem value="category11"> CSS</SelectItem>
                    <SelectItem value="category12"> Bootstrap</SelectItem>
                    <SelectItem value="category13"> Tailwind</SelectItem>
                    <SelectItem value="category14"> Material UI</SelectItem>
                    <SelectItem value="category15"> Ant Design</SelectItem>
                    <SelectItem value="category16"> Vue js</SelectItem>
                    <SelectItem value="category17"> Angular</SelectItem>
                    <SelectItem value="category18"> Svelte</SelectItem>
                    <SelectItem value="category19"> Laravel</SelectItem>
                    <SelectItem value="category20"> Symfony</SelectItem>
                    <SelectItem value="category21"> Ruby on Rails</SelectItem>
                    <SelectItem value="category22"> Django</SelectItem>
                    <SelectItem value="category23"> Flask</SelectItem>
                    <SelectItem value="category24"> Express</SelectItem>
                    <SelectItem value="category25"> Nest js</SelectItem>
                    <SelectItem value="category26"> Spring</SelectItem>
                    <SelectItem value="category27"> Hibernate</SelectItem>
                    <SelectItem value="category28"> MyBatis</SelectItem>
                    <SelectItem value="category29"> Hibernate</SelectItem>
                    <SelectItem value="category30"> Hibernate</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white mt-5'>Create Course</Button>
        </form>
    </div>
  )
}

export default CreateCourse