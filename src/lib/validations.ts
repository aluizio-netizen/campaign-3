import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(80, "Nome muito longo."),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .max(72, "Senha muito longa."),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const aiMessageSchema = z.object({
  conversationId: z.string().optional(),
  mode: z.string().default("free"),
  message: z.string().trim().min(1, "Mensagem vazia.").max(2000),
});

export const quizSubmissionSchema = z.object({
  lessonSlug: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      // resposta pode ser índice (MC) ou texto livre
      value: z.union([z.string(), z.array(z.string())]),
    })
  ),
});

export const pronunciationSchema = z.object({
  lessonSlug: z.string().optional(),
  phrase: z.string().min(1).max(300),
});
