"use client";

import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { CustomFormField } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Audio } from "react-loader-spinner";

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
    setIsLoading(true);
    e.preventDefault();
    const values = formMethods.getValues();

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phonenumber,
      };
      // console.log(userData)

      const User = await createUser(userData);

      if (User) {
        router.push(`/patients/${User.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      {isLoading && (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgb(52 49 61 / 21%);',
      zIndex: 10,
    }}
  >
    <Audio
      height="80"
      width="80"
      radius="9"
      color="green"
      ariaLabel="loading"
    />
  </div>
)}

      <FormProvider {...formMethods}>
       
        {/* Wrap with FormProvider */}
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
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={formMethods.control}
            name="email"
            label="Email"
            placeholder="Shivamgupta@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          {/* Phone Number Field */}
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={formMethods.control}
            name="phonenumber"
            label="Mobile Number"
            placeholder="(91) 25454"
            country="IN"
            international
          />

          {/* Submit Button */}
          <SubmitButton isLoading={isLoading} className="GetButton">
            Get Started
          </SubmitButton>
        </form>
      </FormProvider>
    </>
  );
};

export default PatientForm;
