import { db } from "@/lib/firebase";
import { child, get, ref } from "firebase/database";

export default function GetOneProd(id:number){
    const dbRef = ref(db);
    get(child(dbRef, `produits/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return (snapshot)
      } else {
        console.log("No data available");
        return [];
      }
    }).catch((error) => {
      console.error(error);
    });
}