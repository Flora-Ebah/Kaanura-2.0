import { z } from 'zod'
 
export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Entrez un email valide svp' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Doit contenir au moins 8 caractères.' })
    .regex(/[a-zA-Z]/, { message: 'Doit contenir au moins une lettre.' })
    .regex(/[0-9]/, { message: 'Doit contenir un chiffre au moins' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Doit contenir au moins un caractere special ( @,-,*,&,...)',
    })
    .trim(),
   
})
 
export type FormState =
  | {
      errors?: {
       
        email?: string[]
       password?: string[]
       
      }
      message?: string
    }
  | undefined