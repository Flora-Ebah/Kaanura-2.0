import { auth, db } from "/lib/firebase";
import { LoginFormSchema } from "/lib/loginChecker";


import { signInWithEmailAndPassword } from "firebase/auth";
import { child, get, ref, set, update } from "firebase/database";


import toast from "react-hot-toast";

export async function LoginFun(email: string, password: string) {
  const date = new Date();
  
  
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email,
    password
  });
  const dbRef = ref(db)
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log("failed")
    return Object.values(validatedFields.error.flatten().fieldErrors).map(
      (data:any) => data.map((d) => toast.error(d))
      
    );
    //   errors: validatedFields.error.flatten().fieldErrors,
  } else {
    console.log("failed 24")
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (user) => (
          console.log(user),
          update(ref(db, "users/" + user.user.uid), {
            login_at: date.toDateString()
          }),
          toast.success("Bienvenue!"),
          
          get(child(dbRef, `users/${user.user.uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              localStorage.setItem("Users", JSON.stringify(snapshot.val()));
              if(snapshot.val().role == "admin") {
                localStorage.setItem("mma",1)
                window.location.href = "/admin/"
              }else{
                window.location.href = "/"
                localStorage.setItem("mma",0)
              }
            } else {
              console.log("No data available");
              // return [];
            }
          }).catch((error) => {
            console.error(error);
          })
          
          
          
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
