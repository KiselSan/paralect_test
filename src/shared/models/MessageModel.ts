interface Message {
  id: string,
  text: string,
  image?: string,
  chat_id: string,
  created_at: Date,
  updated_at: Date,
}

export default Message;