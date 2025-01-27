import { auth, db } from "/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";
import { ref, set } from "firebase/database";
import toast from "react-hot-toast";

export default function Reservation(data: any) {
  const id = Date.now()
  ///verifier la connexion avant d'vancer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("dans le onAuthStateChanged", typeof(data))
      console.log(data)
      if (typeof(data) == "object") {
        
        console.log("randomed", id);
        set(ref(db,`Reservation/${user.uid}/${id}`),data)
        toast.success("Produit enregistré avec succés")
        // SendMails()
      }else{
       
        set(ref(db,`Reservation/${user.uid}/${id}`),data)
        toast.success("Produits enregistrés avec succés")
        // SendMails()
      }
    } else {
      toast.error("Priere de bien vouloir vous connectez")
    }
  });
}
