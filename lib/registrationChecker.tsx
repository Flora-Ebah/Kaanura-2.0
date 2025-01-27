import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Votre nom doit contenir au moins 2 caracteres.' })
    .trim(),
surname: z
    .string()
    .min(2, { message: 'Votre prenom doit contenir au moins 2 caracteres ' })
    .trim(),
  email: z.string().email({ message: 'Entrez un email valide svp' }).trim(),
  tel: z.string().min(9,{ message: 'Entrez un numéro valide svp' }).max(9,{ message: 'Entrez un numéro valide' }),
  password: z
    .string()
    .min(8, { message: 'Doit contenir au moins 8 caractères.' })
    .regex(/[a-zA-Z]/, { message: 'Doit contenir au moins une lettre.' })
    .regex(/[0-9]/, { message: 'Doit contenir un chiffre au moins' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Doit contenir au moins un caractere special ( @,-,*,&,...)',
    })
    .trim(),
    confPassword: z
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
        name?: string[]
        surname?: string[]
        email?: string[]
        tel?: string[]
        password?: string[]
        confPassword?: string[]
      }
      message?: string
    }
  | undefined