import { db } from "/lib/firebase"
import { push, ref } from "firebase/database"

import toast from "react-hot-toast"

export default function SaveProduct(nom:string,categorie:string,price:string,quantity:string, statut:string,  image:string){
    // alert(JSON.parse(image).url)
    push(ref(db,`produits/`),{
        title:nom,
        img:image,
        price : `${price} €`,
        categorie,
        stock: quantity,
        
    }).then(res=>(
      console.log(res),
      toast.success("Produit ajouté avec succés")
    //   window.location.href = "/"
    
    ))
}