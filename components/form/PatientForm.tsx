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
      console.log(userData);

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
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        {/* Full Name Field */}
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Shivam Gupta"
            {...formMethods.register("name")}
            className="input"
          />
        </div>

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
        <SubmitButton isLoading={isLoading} className="GetButton">
          Get Started
        </SubmitButton>
      </form>
    </FormProvider>
  );
};

export default PatientForm;
