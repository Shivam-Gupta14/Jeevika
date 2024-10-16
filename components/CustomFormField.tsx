/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
'import FormFieldType from "./form/PatientForm"'
import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  
} from "@/components/ui/form"; // Ensure correct path to your form components
import 'react-phone-number-input/style.css';
import { Control, Controller, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input"; // Correct import for Input
import { FormFieldType } from "./form/PatientForm";
import Image from "next/image"; // Assuming you're using Next.js Image
import PhoneInput from 'react-phone-number-input';
import { E164Number } from "libphonenumber-js/core";

// Define the structure of the form data
interface FormData {
  username: string;
  phonenumber: string;  // Include all the necessary fields here
}

interface CustomProps {
  control: Control<any>;
  name: keyof FormData; // Ensure name is a key from FormData
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderInput = ({
  field,
  props,
}: {
  field: FieldValues;
  props: CustomProps;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"
              disabled={props.disabled}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="IN"  // Specify the default country, e.g., "IN" for India
            placeholder={props.placeholder}
            international  // Ensure international is passed
            withCountryCallingCode  // Ensure calling code is shown
            value={field.value as E164Number | undefined}
            onChange={field.onChange}  // Properly pass the onChange handler
            className="input-phone"
          />
        </FormControl>
      );

    default:
      break;
  }
};

export const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="shad_error" />
        </FormItem>
      )}
    />
  );
};
