'use server'
import { ID, Query } from "node-appwrite"
import { patients } from "../appwrite.config"

export const createPatient = async (patient: CreateUserParams) => {
  try {
    const newPatient = await patients.create(ID.unique(), patient.email, patient.phone, undefined, patient.phone)
    return newPatient

  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await patients.list([
        Query.equal('email', [patient.email])
      ])
      console.error("An error occurred while creating a new user:", error);

      return documents.users[0]
    }
  }
}

export const getPatient = async (id: string) => {
  try {

    return await patients.get(id)

  } catch (error) {
    console.error(error)
  }
}

export const registerPatient = async () => {

}