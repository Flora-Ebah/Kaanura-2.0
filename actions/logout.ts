import { auth } from "/lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

export default function Logout(){
    signOut(auth).then(() => {
        toast.success("A bientôt...")
        window.location.href = "/";
      }).catch((error:any) => {
        // An error happened.
        toast.error("Erreur lors de la déconnexion...")
        console.error("Error signing out:", error?.message);
      });
}