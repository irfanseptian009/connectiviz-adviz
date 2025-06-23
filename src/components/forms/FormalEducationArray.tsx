"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormalEducation } from "@/types/employee";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface FormalEducationArrayProps {
  educations: FormalEducation[];
  onAdd: (education: FormalEducation) => void;
  onRemove: (index: number) => void;
}

export function FormalEducationArray({ 
  educations, 
  onAdd, 
  onRemove 
}: FormalEducationArrayProps) {
  const [education, setEducation] = useState<FormalEducation>({ 
    level: "", 
    schoolName: "", 
    major: "", 
    yearGraduate: undefined,
    gpa: undefined
  });

  const handleAdd = () => {
    if (!education.level.trim() || !education.schoolName.trim()) {
      return;
    }
    
    onAdd({
      ...education,
      level: education.level.trim(),
      schoolName: education.schoolName.trim(),
      major: education.major?.trim() || undefined,
      yearGraduate: education.yearGraduate || undefined,
      gpa: education.gpa || undefined
    });
    
    // Reset form
    setEducation({ 
      level: "", 
      schoolName: "", 
      major: "", 
      yearGraduate: undefined,
      gpa: undefined
    });
  };

  const handleYearChange = (value: string) => {
    const yearNumber = value ? Number(value) : undefined;
    setEducation(prev => ({ ...prev, yearGraduate: yearNumber }));
  };

  const handleGpaChange = (value: string) => {
    const gpaNumber = value ? Number(value) : undefined;
    setEducation(prev => ({ ...prev, gpa: gpaNumber }));
  };

  function setValue(field: keyof FormalEducation, value: string): void {
    setEducation(prev => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <Label htmlFor="level" className="mb-2">Education Level *</Label>
                <Select onValueChange={(value) => setValue("level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Education Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Elementary School">Elementary School (SD)</SelectItem>
                    <SelectItem value="Junior High School">Junior High School (SMP)</SelectItem>
                    <SelectItem value="Senior High School">Senior High School (SMA/SMK)</SelectItem>
                    <SelectItem value="Diploma I">Diploma I (D1)</SelectItem>
                    <SelectItem value="Diploma II">Diploma II (D2)</SelectItem>
                    <SelectItem value="Diploma III">Diploma III (D3)</SelectItem>
                    <SelectItem value="Diploma IV">Diploma IV (D4)</SelectItem>                    <SelectItem value="Bachelor's Degree">Bachelor&apos;s Degree (S1)</SelectItem>
                    <SelectItem value="Master's Degree">Master&apos;s Degree (S2)</SelectItem>
                    <SelectItem value="Doctoral Degree">Doctoral Degree (S3)</SelectItem>
                    <SelectItem value="Professional Degree">Professional Degree</SelectItem>
                  </SelectContent>
                </Select>
        </div>
        
        <div>
          <Label htmlFor="schoolName" className="mb-2">School/University Name *</Label>
          <Input
            id="schoolName"
            value={education.schoolName}
            onChange={(e) => setEducation(prev => ({ ...prev, schoolName: e.target.value }))}
            placeholder="School Name"
          />
        </div>
        
        <div>
          <Label htmlFor="major" className="mb-2">Major/Field</Label>
          <Input
            id="major"
            value={education.major || ""}
            onChange={(e) => setEducation(prev => ({ ...prev, major: e.target.value }))}
            placeholder="Computer Science"
          />
        </div>
        
        <div>
          <Label htmlFor="graduateYear" className="mb-2">Graduation Year</Label>
          <Input
            id="graduateYear"
            type="number"
            value={education.yearGraduate || ""}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="2023"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
        
        <div>
          <Label htmlFor="gpa" className="mb-2">GPA</Label>
          <Input
            id="gpa"
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={education.gpa || ""}
            onChange={(e) => handleGpaChange(e.target.value)}
            placeholder="3.50"
          />
        </div>
      </div>

      <Button 
        type="button" 
        className="w-xm" 
        onClick={handleAdd}
        disabled={!education.level.trim() || !education.schoolName.trim()}
      >
        + Add
      </Button>

      {/* Display added educations */}
      <div className="space-y-2">
        {educations.map((edu, index) => (
          <Card key={index} className="p-3 bg-muted/50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold">
                  <span>{edu.level}</span>
                  <span className="text-muted-foreground">–</span>
                  <span>{edu.schoolName}</span>
                  {edu.yearGraduate && (
                    <span className="text-sm text-muted-foreground">({edu.yearGraduate})</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {edu.major && <span>Major: {edu.major}</span>}
                  {edu.major && edu.gpa && <span> | </span>}
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
