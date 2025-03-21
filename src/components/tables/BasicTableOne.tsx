import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import Image from "next/image";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  Departement: string;
  team: {
    images: string[];
  };
  status: string;
  Branch: string;
}

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Irfan",
      role: "Software Developer",
    },
    Departement: "IT",
    team: {
      images: [
        "/images/user/user-09.jpg",
        "/images/user/user-06.jpg",
      
      ],
    },
    Branch: "Arva",
    status: "Probation",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-14.jpg",
      name: "rizni",
      role: "Marketing",
    },
    Departement: "Marketing",
    team: {
      images:   [
        "/images/user/user-05.jpg",
       
      ],
    },
    Branch: "Arva",
    status: "Probation",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Tasya",
      role: "Software Developer",
    },
    Departement: "IT",
    team: {
      images: [
        "/images/user/user-09.jpg",
        "/images/user/user-06.jpg",
       
      ],
    },
    Branch: "Arva",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-01.jpg",
      name: "cornel",
      role: "Acounting",
    },
    Departement: "Finance",
    team: {
      images: [
        "/images/user/user-05.jpg",
        "/images/user/user-07.jpg",
        "/images/user/user-08.jpg",
     
     
      ],
    },
    Branch: "Arva",
    status: "active",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-19.jpg",
      name: "Asteria",
      role: "Acounting Supervisor",
    },
    Departement: "Finance",
    team: {
      images: [
        "/images/user/user-02.jpg",
        "/images/user/user-10.jpg",
        "/images/user/user-08.jpg",
      ],
    },
    Branch: "Arva",
    status: "Active",
  },
  {
    id: 6,
    user: {
      image: "/images/user/user-16.jpg",
      name: "Detania",
      role: "Acounting",
    },
    Departement: "Finance",
    team: {
      images: [
        "/images/user/user-08.jpg",
        "/images/user/user-04.jpg",
        "/images/user/user-10.jpg",
      ],
    },
    Branch: "Arva",
    status: "Active",
  },
];

export default function BasicTableOne() {
  return (
    <div className="overflow-hidden pallet p-4 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px] p-2">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b  border-purple-300 dark:border-white/[2.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Departement
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Team
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Location
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-300 dark:divide-white/[2.05]">
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={order.user.image}
                          alt={order.user.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {order.user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.Departement}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {order.team.images.map((teamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={teamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Active"
                          ? "success"
                          : order.status === "Probation"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.Branch}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
