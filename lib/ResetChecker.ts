import { z } from 'zod'
 
export const ResetChecker = z.object({
  email: z.string().email({ message: 'Entrez un email valide svp' }).trim(),   
})
 
export type FormState =
  | {
      errors?: {
       
        email?: string[]
      
       
      }
      message?: string
    }
  | undefined