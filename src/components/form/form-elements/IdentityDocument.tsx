"use client";

import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";


export default function IdentityDocument() {


  return (
    <ComponentCard className="shadow-lg" title="Identitiy Documents">
        {/* Identity Documents */}
        <div>
          <Label>No KTP</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No KK</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No BPJS TK</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No BPJS Kes</Label>
          <Input type="text" />
        </div>
    </ComponentCard>
  );
}
