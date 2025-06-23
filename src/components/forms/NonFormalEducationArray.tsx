"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { NonFormalEducation } from "@/types/employee";
import { X } from "lucide-react";

interface NonFormalEducationArrayProps {
  educations: NonFormalEducation[];
  onAdd: (education: NonFormalEducation) => void;
  onRemove: (index: number) => void;
}

export function NonFormalEducationArray({ 
  educations, 
  onAdd, 
  onRemove 
}: NonFormalEducationArrayProps) {
  const [education, setEducation] = useState<NonFormalEducation>({ 
    name: "", 
    institution: "", 
    year: undefined, 
    description: "" 
  });

  const handleAdd = () => {
    if (!education.name.trim() || !education.institution.trim()) {
      return;
    }
    
    onAdd({
      ...education,
      name: education.name.trim(),
      institution: education.institution.trim(),
      year: education.year || undefined,
      description: education.description?.trim() || undefined
    });
    
    // Reset form
    setEducation({ 
      name: "", 
      institution: "", 
      year: undefined, 
      description: "" 
    });
  };

  const handleYearChange = (value: string) => {
    const yearNumber = value ? Number(value) : undefined;
    setEducation(prev => ({ ...prev, year: yearNumber }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="courseName">Course Name *</Label>
          <Input
            id="courseName"
            value={education.name}
            onChange={(e) => setEducation(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Course Name"
          />
        </div>
        
        <div>
          <Label htmlFor="institution">Institution *</Label>
          <Input
            id="institution"
            value={education.institution}
            onChange={(e) => setEducation(prev => ({ ...prev, institution: e.target.value }))}
            placeholder="Institution"
          />
        </div>
        
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={education.year || ""}
            onChange={(e) => handleYearChange(e.target.value)}
            placeholder="2023"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={education.description || ""}
            onChange={(e) => setEducation(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description (optional)"
          />
        </div>
      </div>
      
      <Button 
        type="button" 
        className="w-xm" 
        onClick={handleAdd}
        disabled={!education.name.trim() || !education.institution.trim()}
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
                  <span>{edu.name}</span>
                  <span className="text-muted-foreground">–</span>
                  <span>{edu.institution}</span>
                  {edu.year && (
                    <span className="text-sm text-muted-foreground">({edu.year})</span>
                  )}
                </div>
                {edu.description && (
                  <p className="text-sm text-muted-foreground mt-1 italic">
                    {edu.description}
                  </p>
                )}
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
