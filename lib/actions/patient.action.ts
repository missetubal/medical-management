'use server'
import { ID, InputFile, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils"

/**
 * Create a new patient with the given params.
 * @param patient the user info to create a new patient with
 * @returns the newly created patient
 * @throws AppwriteException
 * @throws Error when the email already exists
 */
export const createPatient = async (patient: CreateUserParams) => {
  console.log("Creating new patient with:", patient)
  try {
    const newPatient = await users.create(
      ID.unique(),
      patient.email,
      patient.phone,
      undefined, //password
      patient.phone)

    console.log("New patient created:", newPatient)
    return newPatient

  } catch (error: any) {
    if (error && error?.code === 409) {
      console.error("Email already exists in database. Checking if the existing user is already a patient.")
      const documents = await users.list([
        Query.equal('email', [patient.email])
      ])

      console.log('teste aqui', documents.users[0])
      return documents.users[0]
    }
  }
}

export const getUser = async (id: string) => {
  try {

    return await users.get(id)

  } catch (error) {
    console.error(error)
  }
}

/**
 * Register a new patient.
 *
 * @param identificationDocument - If provided, the file will be uploaded to the appwrite storage and the id and url will be saved to the patient document.
 * @param patient - The patient data to be saved.
 * @returns The saved patient document.
 */
export const registerPatient = async ({ identificationDocument, ...patient }: RegisterPatientParams) => {
  try {
    console.log('registerPatient - identificationDocument', identificationDocument)
    console.log('registerPatient - patient', patient)
    let file;
    if (identificationDocument) {
      console.log('registerPatient - identificationDocument', identificationDocument)
      const inputFile = InputFile.fromBlob(
        identificationDocument.get('blobFile') as Blob,
        identificationDocument.get('fileName') as string
      )

      console.log('registerPatient - inputFile', inputFile)
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
      console.log('registerPatient - file', file)
    }
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT!}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      })

    console.log('registerPatient - newPatient', newPatient)

    return parseStringify(newPatient)

  } catch (error) {
    console.error(error)
  }
}

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};