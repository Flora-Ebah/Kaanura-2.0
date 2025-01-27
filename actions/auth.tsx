import {  SignupFormSchema } from "@/lib/registrationChecker"
// import toast from "react-hot-toast"

 
export async function signup(name:string,surname:string,tel:string,email:string,password:string,confPassword:string) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name,
    surname,
    tel,
    email,
    password,
    confPassword,
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return (
       
        Object.values( validatedFields.error.flatten().fieldErrors).map((data)=>(
            console.log(data.length)
        ))
    )
    //   errors: validatedFields.error.flatten().fieldErrors,
    
    
  }
 
  // Call the provider or db to create a user...
}