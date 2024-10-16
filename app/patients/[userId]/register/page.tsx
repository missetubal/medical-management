"use client";
import RegisterForm from "@/app/src/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.action";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";


export default async function RegisterPage({ params: { patientId } }: SearchParamProps) {
  const teste = useParams();
  console.log(teste, 'caaa')
  const user = await getUser(patientId);
  const patient = await getPatient(patientId);

  if (patient) redirect(`/patients/${patientId}/new-appointment`);

  return (
    patient ?
      (<div className="flex h-screen max-h-screen">
        <section className="remove-scrollbar container">
          <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />
            <RegisterForm user={user!} />

            <p className="copyright py-12">
              © 2024 Medical Management
            </p>

          </div>
        </section>
        <Image src="/assets/images/register-img.png" height={1000} width={1000} alt="register img" className="side-img max-w-[390px]" />
      </div>
      ) : (
        <div></div>
      ))
}
