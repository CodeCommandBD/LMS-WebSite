import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const Login = () => {
  return (
     <div className="mt-20 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700 ">
          Login
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Welcome back! Please enter your details.
        </p>
        <div>
          <form onSubmit={""} className="flex flex-col gap-6">
            <div>
              <Label className="block text-gray-700 font-bold mb-2">
                Email
              </Label>
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div>
              <Label className="block text-gray-700 font-bold mb-2">
                Password
              </Label>
              <Input type="password" placeholder="Enter your password" />
            </div>
            <div>
              <Label className="block text-gray-700 font-bold mb-2">Role</Label>

              <RadioGroup defaultValue="option-one" className="flex gap-3">
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    className="text-blue-500 "
                    value="option-one"
                    id="option-one"
                  />
                  <Label htmlFor="option-one">Student</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    className="text-blue-500"
                    value="option-two"
                    id="option-two"
                  />
                  <Label htmlFor="option-two">Teacher</Label>
                </div>
              </RadioGroup>
            </div>
            <Button className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer" type="submit">Login</Button>
            <p className="text-center text-gray-600 mt-4">
              Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login