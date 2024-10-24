'use client';

import { useRouter } from "next/navigation"; 
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/Validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form"; // Import FormProvider
import { z } from "zod";
import { CustomFormField } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
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
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phonenumber,
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
    <FormProvider {...formMethods}>  {/* Wrap with FormProvider */}
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex-1 space-y-6">
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
  );
};

export default PatientForm;
