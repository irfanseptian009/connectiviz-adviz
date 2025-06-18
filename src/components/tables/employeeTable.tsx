"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RiDeleteBin5Line, RiEditLine } from "react-icons/ri";
import { User } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Mail, Phone, Building } from "lucide-react";

type Props = {
  data: User[];
  onView(id: number): void;
  onEdit(id: number): void;
  onDelete(id: number): void;
};

export default function EmployeeTable({ data = [], onView, onEdit, onDelete }: Props) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase() || '??';
  };

  const getRoleColor = (role?: string) => {
    switch (role?.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EMPLOYEE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="text-sm">
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <TableRow className="hover:bg-transparent">
              <TableCell isHeader className="w-[280px] p-4 font-semibold text-gray-700 dark:text-gray-300">
                Employee
              </TableCell>
              <TableCell isHeader className="p-4 font-semibold text-gray-700 dark:text-gray-300">
                Contact
              </TableCell>
              <TableCell isHeader className="p-4 font-semibold text-gray-700 dark:text-gray-300">
                Role
              </TableCell>
              <TableCell isHeader className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-center">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {(data?.length ?? 0) > 0 ? (
              data.map((user) => (                <tr 
                  key={user.id} 
                  className={`
                    transition-all duration-200 border-b border-gray-100 dark:border-gray-800
                    ${hoveredRow === user.id 
                      ? 'bg-blue-50 dark:bg-blue-950/30 shadow-sm' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                    }
                  `}
                  onMouseEnter={() => setHoveredRow(user.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Employee Info Column */}
                  <TableCell className="p-4">
                    <button
                      onClick={() => onView(user.id)}
                      className={`
                        flex items-center gap-3 w-full text-left group
                        transition-all duration-200 rounded-lg p-2 -m-2
                        ${hoveredRow === user.id 
                          ? 'bg-white dark:bg-gray-800 shadow-md scale-[1.02]' 
                          : 'hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                        }
                      `}
                    >
                      {/* Avatar */}
                      <div className={`
                        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        font-semibold text-sm transition-all duration-200
                        ${hoveredRow === user.id 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }
                      `}>
                        {getInitials(user.name || user.fullName || '')}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className={`
                          font-semibold transition-colors duration-200
                          ${hoveredRow === user.id 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }
                        `}>
                          {user.name || user.fullName || 'No Name'}
                        </div>
                        {user.position && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {user.position}
                          </div>
                        )}
                      </div>

                      {/* View Icon */}
                      <div className={`
                        flex-shrink-0 transition-all duration-200
                        ${hoveredRow === user.id 
                          ? 'opacity-100 transform scale-110' 
                          : 'opacity-0 group-hover:opacity-100'
                        }
                      `}>
                        <Eye className="h-4 w-4 text-blue-500" />
                      </div>
                    </button>
                  </TableCell>

                  {/* Contact Column */}
                  <TableCell className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {user.email || '-'}
                      </div>
                      {user.phoneNumber && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          {user.phoneNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Role Column */}
                  <TableCell className="p-4">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-medium ${getRoleColor(user.role)}`}
                    >
                      {user.role?.replace('_', ' ') || 'No Role'}
                    </Badge>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="p-4">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(user.id)}
                        className={`
                          h-8 w-8 p-0 transition-all duration-200
                          ${hoveredRow === user.id 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-md' 
                            : 'text-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300'
                          }
                        `}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user.id)}
                        className="h-8 w-8 p-0 text-orange-500 hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-900 dark:hover:text-orange-300"
                        title="Edit Employee"
                      >
                        <RiEditLine className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
                        title="Delete Employee"
                      >
                        <RiDeleteBin5Line className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </tr>
              ))
            ) : (
              <TableRow>
                <td colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        No employees found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        There are no employees matching your search criteria.
                      </p>
                    </div>
                  </div>
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
