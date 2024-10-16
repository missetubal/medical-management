// import { createPatient } from '@/lib/actions/patient.action';
// import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
// import "@testing-library/jest-dom";
// import { Client, Databases } from 'appwrite';


// jest.mock('appwrite', () => ({
//   Client: jest.fn().mockImplementation(() => ({
//     config: {},
//     setEndpoint: jest.fn(),
//     setProject: jest.fn(),
//   })),
//   Databases: jest.fn().mockImplementation(() => ({
//     createDocument: jest.fn(),
//     listDocuments: jest.fn(),
//   })),
//   ID: {
//     unique: jest.fn(() => 'unique-id'),
//   },
//   Query: {
//     equal: jest.fn(),
//   },
// }));


// describe("createPatient", () => {
//   const dummyPatient = {
//     name: "John Doe",
//     email: "jdoe@me.com",
//     phone: "+1234567890",
//   };

//   let databases: Databases;
//   beforeEach(() => {
//     // Instância do `Databases` mockada
//     const client = new Client();
//     databases = new Databases(client);  // Usa um cliente válido mockado
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should create a new patient successfully', async () => {
//     const mockNewPatient: User = { $id: 'unique-id', ...dummyPatient };

//     const result = await createPatient(dummyPatient);

//     expect(databases.createDocument).toHaveBeenCalledWith(
//       'database-id',
//       'collection-id',
//       'unique-id',
//       {
//         email: dummyPatient.email,
//         phone: dummyPatient.phone,
//       }
//     );

//     expect(result).toEqual(mockNewPatient);
//   });
// })