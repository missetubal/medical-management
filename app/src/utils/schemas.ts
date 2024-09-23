
import { z } from 'zod'

export const patientFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string()
  // .refine((phone) => /^\d{10,15}$/.test(phone), 'Invalid phone number')
})

export const registerFormSchema = z.object({})