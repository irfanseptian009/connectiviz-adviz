"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isActive: boolean;
}

export function FormSection({
  title,
  icon: Icon,
  children,
  isActive,
}: FormSectionProps) {
  return (
    <Card
      className={`transition-all duration-300 ${
        isActive ? "ring-2 dark:ring-blue-500/20 ring-blue-100 shadow-lg" : "hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          <Icon className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

interface InputFieldProps {
  label: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

export function InputField({
  label,
  icon: Icon,
  children,
  error,
  required = false,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && (
        <span className="text-red-500 text-xs font-medium">{error}</span>
      )}
    </div>
  );
}
