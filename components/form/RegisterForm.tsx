/* eslint-disable react/jsx-no-undef */
'use client';

import { useRouter } from "next/navigation"; 
import { createUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { UserFormValidation } from "@/lib/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form"; 
import { z } from "zod";
import { CustomFormField } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FormFieldType } from "./PatientForm";
import { Doctors, GenderOptions } from "@/constants"; 
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@radix-ui/react-select";


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation schema
  const formMethods = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phonenumber: "",
      address: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      gender: "",
      birthDate: null,
    },
  });

  // Define form submission handler
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phonenumber,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        gender: values.gender,
        birthDate: values.birthDate,
      };

      const User = await createUser(userData);

      if (User) {
        router.push(`/patients/${User.$id}/register`); 
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex-1 space-y-12">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        {/* Full Name Field */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={formMethods.control}
          name="name"
          label="Full Name"
          placeholder="Shivam Gupta"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        {/* EMAIL & PHONE */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={formMethods.control}
            name="email"
            label="Email"
            placeholder="Shivamgupta@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={formMethods.control}
            name="phonenumber"
            label="Mobile Number"
            placeholder="(91) 25454"
          />
        </div>

        {/* BirthDate & Gender */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={formMethods.control}
            name="birthDate"
            label="Date of birth"
          />
          <CustomFormField
            fieldType={FormFieldType.GENDER_SELECT}
            control={formMethods.control}
            name="gender"
            label="Gender"
          />
        </div>

        {/* Address & Occupation */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={formMethods.control}
            name="address"
            label="Address"
            placeholder="S-21 Ashok nagar"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={formMethods.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        {/* Emergency Contact Name & Emergency Contact Number */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={formMethods.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's name"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={formMethods.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(555) 123-4567"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
         
           {/* PRIMARY CARE PHYSICIAN */}
           <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={formMethods.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </section>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} className="GetButton">
          Get Started
        </SubmitButton>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
