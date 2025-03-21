import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import InputStates from "@/components/form/form-elements/InputStates";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import { Metadata } from "next";
import React from "react";
import IdentityDocument from "@/components/form/form-elements/IdentityDocument";
import EmployeeInformation from "@/components/form/form-elements/EmployeeInformation";
import ContactInformation from "@/components/form/form-elements/ContactInformation";
import PersonalInformation from "@/components/form/form-elements/PersonalInformation";

export const metadata: Metadata = {
  title: "form page | connectiviz",
  description:
    " form page for connectiviz by adviz",
};

export default function FormElements() {
  return (
    <div className="nav p-10">     
      <PageBreadcrumb pageTitle="From Employee" />
      <div className="">
      <div className=" bg-blue-50 dark:bg-gray-900 rounded-t-[50px] rounded-b-xl">
      <div className="h-20 rounded-t-[50px] opacity-50 bg-gradient-to-r from-[#EBB317] to-[#1D95D7]"></div>
      <div className="grid grid-cols-1   p-5  gap-6 xl:grid-cols-2">
      <div className="space-y-6">
      
          <PersonalInformation/>
          <DropzoneComponent />
          <InputStates />
        </div>
        <div className="space-y-6 ">
         <FileInputExample />
          <IdentityDocument />
          <EmployeeInformation />
          <SelectInputs />
          <TextAreaInput />
          <ContactInformation />
       
        </div>
   </div>
     
      </div>

      </div>
    </div>
  );
}
