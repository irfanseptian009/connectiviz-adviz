"use client";

import ComponentCard from "../../common/ComponentCard";
import Input from "../input/InputField";
import Label from "../Label";
import { EnvelopeIcon } from "../../../icons";
import PhoneInput from "../group-input/PhoneInput";


export default function ContactInformation() {
  const countries = [
    { code: "ID", label: "+62"},
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };

  return (
    <ComponentCard title="Contact Information">
     {/* Contact Information */}
     <div>
          <Label>Email</Label>
          <div className="relative">
            <Input
              placeholder="info@gmail.com"
              type="text"
              className="pl-[62px]"
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon />
            </span>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="start"
            countries={countries}
            placeholder="+62 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>{" "}
        <div>
          <Label>Phone</Label>
          <PhoneInput
            selectPosition="end"
            countries={countries}
            placeholder="+62 (555) 000-0000"
            onChange={handlePhoneNumberChange}
          />
        </div>
        <div>
          <Label>Email Perusahaan</Label>
          <Input type="email" />
        </div>
      
        <div>
          <Label>IG</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <Input type="text" />
        </div>

        {/* Bank Information */}
        <div>
          <Label>Bank Rekening</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>No Rekening</Label>
          <Input type="text" />
        </div>
        <div>
          <Label>Nama Rekening</Label>
          <Input type="text" />
        </div>
    </ComponentCard>
  );
}
