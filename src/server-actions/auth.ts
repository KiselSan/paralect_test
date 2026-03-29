'use server'

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createServer from "@/services/supabase/server";
import PagePaths from "@/shared/constants/pagePaths";

export interface SingProps {
  email: string
  password: string
}

export const singUp = async ({ email, password }: SingProps) => {
  const supabaseServer = await createServer();
  const { error } = await supabaseServer.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(PagePaths.BASE);
  redirect(PagePaths.BASE)
}

export const singIn = async ({ email, password }: SingProps) => {
  const supabaseServer = await createServer();
  const { error } = await supabaseServer.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(PagePaths.BASE);
  redirect(PagePaths.BASE)
}

export const singOut = async () => {
  const supabaseServer = await createServer();
  const { error } = await supabaseServer.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(PagePaths.BASE);
  redirect(PagePaths.LOGIN)
}