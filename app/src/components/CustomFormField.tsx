import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { E164Number } from "libphonenumber-js/core"
import Image from "next/image"
import React from "react"
import { Control } from "react-hook-form"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { FieldTypeEnum } from "../utils/enum"

import DatePicker from "react-datepicker"

import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import "react-datepicker/dist/react-datepicker.css"


interface CustomFormFieldProps {
  control: Control<any>
  name: string
  placeholder?: string
  description?: string
  disabled?: boolean
  fieldType: FieldTypeEnum,
  label?: string
  iconSrc?: string
  iconAlt?: string
  dateFormat?: string
  showTimeSelect?: boolean,
  children?: React.ReactNode,
  renderSkeleton?: (field: any) => React.ReactNode

}

interface RenderField {
  props: CustomFormFieldProps
  field: any
}

const RenderField = ({ props, field }: RenderField) => {

  switch (props.fieldType) {
    case FieldTypeEnum.textInput:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              alt={props.iconAlt ?? 'icon'}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl >
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0"

            />
          </FormControl>
        </div>
      );
    case FieldTypeEnum.phoneInput:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      )
    case FieldTypeEnum.datePicker:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            alt="calendar"
            width={24} height={24}
            className="ml-2" />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={props.dateFormat ?? "MM//dd/yyyy"}
              showTimeSelect={props.showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      )
    case FieldTypeEnum.skeleton:
      return (
        props.renderSkeleton ? props.renderSkeleton(field) : null
      );
    case FieldTypeEnum.select:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue>{props.placeholder}</SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )

    case FieldTypeEnum.checkbox:
      return (
        <FormControl>
          <div className="flex items-centergap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor="{props.name}" className="checkbox-label">{props.label}</label>
          </div>
        </FormControl>
      )

    default: break;
  }


}

const CustomFormField = (props: CustomFormFieldProps) => {
  const { control, name, disabled, label, fieldType } = props
  return (
    <FormField
      disabled={disabled ?? false}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FieldTypeEnum.checkbox && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderField props={props} field={field} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />)
}

export default CustomFormField