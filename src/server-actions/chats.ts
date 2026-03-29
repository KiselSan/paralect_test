import createServer from "@/services/supabase/server";
import TableNames from "@/shared/constants/supabaseTableNames";
import Chat from '@/shared/models/ChatModel'
import { getUser } from "@/server-actions/users";

export const createChat = async (chat: Pick<Chat, 'name'>) => {
  const supabaseServer = await createServer();

  const user = await getUser();
  const { data: createdChat, error } = await supabaseServer.from(TableNames.CHATS).insert({
    ...chat,
    user_id: user.id,
    updated_at: Date.now()
  });

  if (error) {
    throw new Error(`Do not create chat: ${error.message}`)
  }

  return createdChat;
}

export const getChatById = async (chat: Pick<Chat, 'id'>) => {
  const supabaseServer = await createServer();

  const { data: foundedChat, error } = await supabaseServer
    .from(TableNames.CHATS)
    .select('*')
    .eq('id', chat.id)
    .single();

  if (error) {
    throw new Error(`Do not found chat: ${error.message}`)
  }

  return foundedChat;
}

export const updateChat = async (chat: Pick<Chat, 'id' | 'name'>) => {
  const supabaseServer = await createServer();

  const { data: updatedChat, error } = await supabaseServer
    .from(TableNames.CHATS)
    .update({
      name: chat.name,
      updated_at: Date.now()
    })
    .eq('id', chat.id);

  if (error) {
    throw new Error(`Do not updated chat: ${error.message}`)
  }

  return updatedChat;
}

export const deleteChat = async (chat: Pick<Chat, 'id'>) => {
  const supabaseServer = await createServer();

  const { error } = await supabaseServer.from(TableNames.CHATS).delete().eq('id', chat.id);

  if (error) {
    throw new Error(`Do not deleted chat with id ${chat.id} : ${error.message}`)
  }

  return chat.id;
}