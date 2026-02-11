import { Button } from "@/components/ui/button";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash } from "lucide-react";
import { Link } from "react-router";

const invoices = [
  {
    courseName: "INV001",
    price: "$250.00",
    discount: "$100.00",
    status: "Published",
  },
  {
    courseName: "INV002",
    price: "$250.00",
    discount: "$150.00",
    status: "Published",
  },
  {
    courseName: "INV003",
    price: "$250.00",
    discount: "$350.00",
    status: "Published",
  },
  {
    courseName: "INV004",
    price: "$250.00",
    discount: "$450.00",
    status: "Published",
  },
  {
    courseName: "INV005",
    price: "$250.00",
    discount: "$550.00",
    status: "Published",
  },
  {
    courseName: "INV006",
    price: "$250.00",
    discount: "$200.00",
    status: "Published",
  },
  {
    courseName: "INV007",
    price: "$250.00",
    discount: "$300.00",
    status: "Published",
  },
];

const Course = () => {
  return (
    <div className="md:p-10 p-4 w-full h-screen bg-gray-50">
      <Button className="flex items-center gap-2">
        <Plus />
        <Link to="/admin/createCourse">Add Course</Link>
      </Button>
      <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Course Name</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Discount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.courseName}>
              <TableCell className="font-medium text-center">
                {invoice.courseName}
              </TableCell>
              <TableCell className="text-center">{invoice.price}</TableCell>
              <TableCell className="text-center">{invoice.discount}</TableCell>
              <TableCell className="text-center">
                {invoice.status}
              </TableCell>
              <TableCell className="text-center">
                <Button className="mr-2 bg-blue-500 hover:bg-blue-600 text-white"><Pencil /></Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white"><Trash /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Course;
