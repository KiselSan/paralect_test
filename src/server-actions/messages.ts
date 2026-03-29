import createServer from "@/services/supabase/server";
import { getChatById } from "@/server-actions/chats";
import Chat from '@/shared/models/ChatModel'
import TableNames from "@/shared/constants/supabaseTableNames";
import Message from "@/shared/models/MessageModel";

const IsExistedChatById = async (chatId: string) => {
  try {
    const chat: Chat = await getChatById({ id: chatId });

    return true
  } catch {
    return false
  }
}

export const createMessage = async (
  chatId: string,
  message: Pick<Message, 'text' | 'image'>
) => {
  const supabaseServer = await createServer();
  const isExistedChat = await IsExistedChatById(chatId);

  if (!isExistedChat) {
    throw new Error("Chat do not exist");
  }

  const { data: createdMessage, error } = await supabaseServer.from(TableNames.MESSAGES).insert({
    ...message,
    chat_id: chatId,
    updated_at: Date.now()
  })

  if (error) {
    throw new Error(`Do not create message: ${error.message}`)
  }

  return createdMessage;
}

export const updateMessage = async (message: Omit<Message, 'created_at'>) => {
  const supabaseServer = await createServer();

  const { data: updatedMessage, error } = await supabaseServer
    .from(TableNames.MESSAGES)
    .update({
      text: message.text,
      image: message.image,
      updated_at: Date.now()
    })
    .eq('id', message.id);

  if (error) {
    throw new Error(`Do not update message: ${error.message})`)
  }

  return updatedMessage;
}