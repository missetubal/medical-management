"use client";
import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { registerPatient } from "@/lib/actions/patient.action";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldTypeEnum } from "../../utils/enum";
import { registerFormSchema } from "../../utils/schemas";
import CustomFormField from "../CustomFormField";
import FileUploader from "../FileUploader";
import { SubmitButton } from "../ui/SubmitButton";



const RegisterForm = async ({ user: user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone
    },
  })

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);

    let formData;
    if (values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFiles = new Blob([values.identificationDocument[0]], { type: values.identificationDocument[0].type });
      formData = new FormData();
      formData.append("file", blobFiles);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const newPatientData = {
        ...values,
        patientId: user.$id,
        birthDate: new Date(values.birthDate),
        privacyConsent: values.privacyConsent,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
      }

      const registerNewPatient = await registerPatient(newPatientData)
      if (registerNewPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          control={form.control}
          name="fullname"
          label="Full Name"
          fieldType={FieldTypeEnum.textInput}
          iconSrc="/assets/icons/user.svg"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">

          <CustomFormField
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            fieldType={FieldTypeEnum.datePicker}
          />
          <CustomFormField
            control={form.control}
            name="gender"
            placeholder="+00 00000 0000"
            label="Gender"
            fieldType={FieldTypeEnum.skeleton}
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  {GenderOptions.map(option => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem
                        value={option}
                      >
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </RadioGroupItem>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="adress"
            label="Adress"
            fieldType={FieldTypeEnum.textInput}
          />
          <CustomFormField
            control={form.control}
            name="occupation"
            label="Occupation"
            fieldType={FieldTypeEnum.textInput}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            name="emergencyContactName"
            placeholder="Guardian Name"
            label="Emergency contact name"
            fieldType={FieldTypeEnum.textInput}
          />
          <CustomFormField
            control={form.control}
            name="emergencyContactPhone"
            placeholder="+00 00000 0000"
            label="Phone Number"
            fieldType={FieldTypeEnum.phoneInput}
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9">
            <h2 className="sub-header">Medical Information</h2>
          </div>

          <CustomFormField
            control={form.control}
            fieldType={FieldTypeEnum.select}
            name="primaryPhysician"
            label="Primary care physician"
          >
            {Doctors.map(doctor => (
              <SelectItem key={doctor.name} value={doctor.name}>
                {doctor.name}
                <div className="flex cursir-pointer flex-col gap-6">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    height={32}
                    width={32}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>


          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="ex:. Blue Cross"
              fieldType={FieldTypeEnum.textInput}
            />
            <CustomFormField
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ex:. 123456789"
              fieldType={FieldTypeEnum.textInput}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="ex:. Penicillin"
              fieldType={FieldTypeEnum.textInput}
            />
            <CustomFormField
              control={form.control}
              name="currentMedication"
              label="Current Medications"
              placeholder="ex:. Aspirin"
              fieldType={FieldTypeEnum.textInput}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              name="familyMedicalHistory"
              label="Family Medical History (if relevant)"
              placeholder="ex:. Diabetes"
              fieldType={FieldTypeEnum.textInput}
            />
            <CustomFormField
              control={form.control}
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="ex:. Hypertension"
              fieldType={FieldTypeEnum.textInput}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
          <CustomFormField
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select Identification Type"
            fieldType={FieldTypeEnum.select}
          >
            {IdentificationTypes.map((type, i) => (
              <SelectItem key={type + i} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FieldTypeEnum.textInput}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="ex:. 123456789"
          />
          <CustomFormField
            control={form.control}
            name="identificationDocument"
            label="Upload Identification Document"
            placeholder="Upload Identification Document"
            fieldType={FieldTypeEnum.skeleton}
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
          <CustomFormField
            fieldType={FieldTypeEnum.checkbox}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FieldTypeEnum.checkbox}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FieldTypeEnum.checkbox}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>
        <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>
      </form>
    </Form >
  )
}

export default RegisterForm