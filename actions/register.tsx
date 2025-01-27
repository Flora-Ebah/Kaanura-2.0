
import { auth, db } from "/lib/firebase"
import { SignupFormSchema } from "/lib/registrationChecker"

import { createUserWithEmailAndPassword } from "firebase/auth"
import { ref, set } from "firebase/database"
import toast from "react-hot-toast"

 
export async function Register(name:string,surname:string,tel:string,email:string,password:string,confPassword:string) {
  // Validate form fields
  console.log("hello")
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
       
        Object.values( validatedFields.error.flatten().fieldErrors).map((data:any)=>(
            data.map((d)=>(
                toast.error(d)
 
            ))
        ))
    )
    //   errors: validatedFields.error.flatten().fieldErrors,
    
    
  }
  else{
    if (password != confPassword){
       return toast.error("Les mots de passe ne sont pas conformes!")
        
    }
    else{
        try {
             await createUserWithEmailAndPassword(auth,
                email,
                password
            ).then((user)=>(set(ref(db,`users/${user.user.uid}`),{
                name,
                surname,
                tel,
                email,
                role:"user"
            }).then(user2=>(
              console.log(user,user2),
              toast.success("Compte créé avec succès!"),
              window.location.href = "/"
            ))))
           
            
        } catch (error:any) {
          if(error.message == "Firebase: Error (auth/email-already-in-use)."){
            toast.error("Cette adresse email est déjà utilisée!")
          }else{
            const message:string = error.message
            toast.error(message.replace("Firebase: ",""))
          }
           
        }
    }
  }
 
  // Call the provider or db to create a user...
}