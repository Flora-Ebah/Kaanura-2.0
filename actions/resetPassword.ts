import { auth } from "@/lib/firebase";
import { ResetChecker } from "@/lib/ResetChecker";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";

export async function ResetPass(email: string) {

 
  const validatedFields = ResetChecker.safeParse({
    email,
  });


  if (!validatedFields.success) {
    return Object.values(validatedFields.error.flatten().fieldErrors).map(
      (data) => data.map((d) => toast.error(d))
    );
  
  } else {
    try {
      await sendPasswordResetEmail(auth, email ).then(
        (res) => (
            console.log(res),
          toast.success("Un mail vous a été envoyé, veuillez verifier vos mails!") 
        )
      );
    } catch (error:any) {
      console.log(error);
      if (error?.message == "Firebase: Error (auth/invalid-credential)."){
        toast.error("Identifiants incorrects!")
      }else{
        toast.error("Une erreur est survenue, veuillez reesayer plus tard")
      }
      // toast.error(error.message);
    }
  }

  // Call the provider or db to create a user...
}
