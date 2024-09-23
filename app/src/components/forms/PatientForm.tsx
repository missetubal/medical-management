"use client"

import { Form } from "@/components/ui/form"
import { createPatient } from "@/lib/actions/patient.action"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FieldTypeEnum } from "../../utils/enum"
import { patientFormSchema } from "../../utils/schemas"
import CustomFormField from "../CustomFormField"
import { SubmitButton } from "../ui/SubmitButton"


const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()


  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })

  async function onSubmit(values: z.infer<typeof patientFormSchema>) {
    const { email, name, phone } = values;
    setIsLoading(true);
    try {
      const newPatientData = { name, email, phone }
      const patient = await createPatient(newPatientData)
      if (patient) {
        router.push(`/patients/${patient.$id}/register`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField
          control={form.control}
          name="fullname"
          placeholder="ex.: Adam Smith"
          label="Full Name"
          fieldType={FieldTypeEnum.textInput}
          iconSrc="/assets/icons/user.svg"
        />
        <CustomFormField
          control={form.control}
          name="email"
          placeholder="ex.: adam@smith.com"
          label="Email Adress"
          fieldType={FieldTypeEnum.textInput}
          iconSrc="/assets/icons/email.svg"
        />
        <CustomFormField
          control={form.control}
          name="phone"
          placeholder="+00 00000 0000"
          label="Phone Number"
          fieldType={FieldTypeEnum.phoneInput}
        />

        <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>
      </form>
    </Form >
  )
}

export default PatientForm