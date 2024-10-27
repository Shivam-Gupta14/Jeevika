/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import 'react-phone-number-input/style.css';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
// Make sure these are correctly imported from their respective locations

import { Control, Controller, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormFieldType } from "./form/PatientForm";
import Image from "next/image";
import PhoneInput from 'react-phone-number-input';
import { E164Number } from "libphonenumber-js/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { GenderOptions } from "@/constants"; // Make sure GenderOptions is defined and imported correctly
import { Label } from "@radix-ui/react-label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"


// Define the structure of the form data
interface FormData {
  username: string;
  phonenumber: string;
  gender: string;
}

interface CustomProps {
  control: Control<any>;
  name: keyof FormData;
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
            defaultCountry="IN"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value ?? null}
              onChange={(date: Date) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );
      case FormFieldType.TEXTAREA:
        return (
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              className="shad-textArea"
              disabled={props.disabled}
            />
          </FormControl>
        );
    case FormFieldType.GENDER_SELECT:
      return (
        <FormControl>
          <RadioGroup
            className="flex h-11 gap-6 xl:justify-between"
            value={field.value || ""}
            onValueChange={field.onChange}
          >
            {GenderOptions.map((option) => (
              <div key={option} className="radio-group flex items-center">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="cursor-pointer ml-2">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </FormControl>
      );
      case FormFieldType.SELECT:
        return (
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="shad-select-trigger">
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="shad-select-content">
                {props.children}
              </SelectContent>
            </Select>
          </FormControl>
        );
        case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
      
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
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
