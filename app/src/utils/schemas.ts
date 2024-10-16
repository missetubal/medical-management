
import { z } from 'zod'

export const patientFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string()
  // .refine((phone) => /^\d{10,15}$/.test(phone), 'Invalid phone number')
})

export const registerFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(30, 'Name must be less than 30 characters'),
  email: z.string().email(),
  phone: z.string().refine((phone) => /^\d{10,15}$/.test(phone), 'Invalid phone number'),
  birthDate: z.coerce.date(),
  gender: z.enum(['Male', 'Female', 'Other']),
  address: z.string().min(5, 'Address must be at least 5 characters').max(100, 'Address must be less than 100 characters'),
  occupation: z.string().min(5, 'Occupation must be at least 5 characters').max(100, 'Occupation must be less than 100 characters'),
  emergencyContactName: z.string().min(3, 'Emergency contact name must be at least 3 characters').max(100, 'Emergency contact name must be less than 100 characters'),
  emergencyContactPhone: z.string().refine((phone) => /^\d{10,15}$/.test(phone), 'Invalid phone number'),
  primaryPhysician: z.string().min(2, 'Select at least one doctor'),
  insuranceProvider: z.string().min(5, 'Insurance provider must be at least 5 characters').max(100, 'Insurance provider must be less than 100 characters'),
  insurancePolicyNumber: z.string().min(5, 'Insurance policy number must be at least 5 characters').max(100, 'Insurance policy number must be less than 100 characters'),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.any().optional(),
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to treatment in order to proceed",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to disclosure in order to proceed",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must consent to privacy in order to proceed",
    }),
  userId: z.string()
})