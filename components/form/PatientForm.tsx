'use client';

import { useRouter } from "next/navigation"; 
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../SubmitButton";

// Enums for form field types
export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  GENDER_SELECT = "GENDER_SELECT",
  SELECT = "SELECT",
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const defaultClick=()=>{
    console.log("clicked default")
  }

  // Initialize form with validation schema
  const formMethods = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phonenumber: "",
    },
  });

  // Define form submission handler
  const handleDebugClick = async (e) => {
    e.preventDefault()
    const values = formMethods.getValues();
    
      try {
        const userData = {
          name: values.name,
          email: values.email,
          phone: values.phonenumber,
        };
        console.log(userData)
  
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
    <FormProvider {...formMethods}>  {/* Wrap with FormProvider */}
    
      <form onSubmit={handleDebugClick} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
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
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Shivamgupta@gmail.com"
            {...formMethods.register("email")}
            className="input"
          />
        </div>

        {/* Phone Number Field */}
        <div className="form-group">
          <label htmlFor="phonenumber">Mobile Number</label>
          <input
            type="tel"
            id="phonenumber"
            placeholder="(91) 25454"
            {...formMethods.register("phonenumber")}
            className="input"
          />
        </div>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} className="GetButton" >
          Get Started
        </SubmitButton>
      </form>
    </FormProvider>
  );
};

export default PatientForm;
