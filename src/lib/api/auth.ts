import { createClient } from "../supabase/client";
import { authSchema } from "../schemas/auth";
import { z } from "zod";

const supabase = createClient();

export async function signin(values: z.infer<typeof authSchema>) {
  const response = await supabase.auth.signInWithPassword(values);
  return response;
}

export async function signout() {
  const response = await supabase.auth.signOut();
  return response;
}

export async function sendResetEmail(email: string) {
  const response = await supabase.auth.resetPasswordForEmail(email);
  return response;
}

export async function exchangeCodeForSession(code: string) {
  const response = await supabase.auth.exchangeCodeForSession(code);
  return response;
}

export async function resetUserPassword(password: string) {
  const response = await supabase.auth.updateUser({ password });
  return response;
}
