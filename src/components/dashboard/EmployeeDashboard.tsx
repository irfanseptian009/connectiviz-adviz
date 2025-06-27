"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Building, Calendar, MapPin } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { formatDateIndonesia } from "@/utils/employeeUtils";

export default function EmployeeDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Loading...</h2>
            <p className="text-gray-600">Fetching your profile information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
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
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <UserAvatar 
              src={user.profilePictureUrl}
              name={user.fullName || user.username}
              size={80}
              className="border-4 border-white/20"
            />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.fullName || user.username}!</h1>
              <p className="text-blue-100 mt-1">Employee Dashboard</p>
              <Badge className={`mt-2 ${getRoleColor(user.role || 'EMPLOYEE')}`}>
                {user.role?.replace('_', ' ') || 'Employee'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900 dark:text-white">{user.fullName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-gray-900 dark:text-white">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-gray-900 dark:text-white">{user.gender || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900 dark:text-white">
                  {user.dateOfBirth ? formatDateIndonesia(user.dateOfBirth) : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{user.email}</span>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-white">{user.phoneNumber}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-white">{user.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Employment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Position</label>
              <p className="text-gray-900 dark:text-white">{user.position || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Division</label>
              <p className="text-gray-900 dark:text-white">{user.division?.name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900 dark:text-white">
                {user.startDate ? formatDateIndonesia(user.startDate) : '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Type</label>
              <p className="text-gray-900 dark:text-white">{user.employmentType || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant={user.isActive !== false ? 'default' : 'destructive'}>
                {user.isActive !== false ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              View Full Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
