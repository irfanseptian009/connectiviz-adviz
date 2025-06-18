import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export interface NonFormalEducation {
  name: string;
  institution: string;
  year?: number;
  description?: string;
}

interface Props {
  educations: NonFormalEducation[];
  onAdd: (education: NonFormalEducation) => void;
}

const NonFormalEducationArray: React.FC<Props> = ({ educations, onAdd }) => {
  const [education, setEducation] = useState<NonFormalEducation>({ name: "", institution: "" });

  const handleAdd = () => {
    if (!education.name || !education.institution) return;
    onAdd({
      ...education,
      year: education.year ? Number(education.year) : undefined,
    });
    setEducation({ name: "", institution: "" });
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4  items-end">
        <div ><Label className="mb-2 ">Name</Label><Input value={education.name} onChange={e => setEducation(ed => ({ ...ed, name: e.target.value }))} placeholder="Course Name" /></div>
        <div><Label className="mb-2">Institution</Label><Input value={education.institution} onChange={e => setEducation(ed => ({ ...ed, institution: e.target.value }))} placeholder="Institution" /></div>
        <div><Label className="mb-2">Year</Label><Input type="number" value={education.year || ""} onChange={e => setEducation(ed => ({ ...ed, year: e.target.value ? Number(e.target.value) : undefined }))} placeholder="Year" /></div>
        <div><Label className="mb-2">Description</Label><Input value={education.description || ""} onChange={e => setEducation(ed => ({ ...ed, description: e.target.value }))} placeholder="Desc (optional)" /></div>
        <Button type="button" className="col-span-4 mt-4 dark:bg-slate-700 dark:text-white" onClick={handleAdd}>Add</Button>
      </div>
      <div className="space-y-2">
        {educations.map((edu, i) => (
          <Card key={i} className="p-3 bg-muted">
            <div className="flex gap-4 ">
              <span className="font-semibold">{edu.name}</span> – {edu.institution} {edu.year ? <span>({edu.year})</span> : null}
              {edu.description ? <span className="ml-2 italic text-sm">{edu.description}</span> : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default NonFormalEducationArray;
