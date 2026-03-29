import createServer from "@/services/supabase/server";

export const getUser = async () => {
  const supabaseServer = await createServer();

  const { data: { user: user }, error } = await supabaseServer.auth.getUser();

  if (!user || !error) {
    throw new Error(`Do not found current User (${error?.message}})`)
  }

  return user;
}


export const updateUserEmail = async (newEmail: string) => {
  const supabaseServer = await createServer();

  const { data: { user: user }, error } = await supabaseServer.auth.updateUser({ email: newEmail });

  if (!user || error) {
    throw new Error(`Do not update user Email (${error?.message})`)
  }

  return user;
}