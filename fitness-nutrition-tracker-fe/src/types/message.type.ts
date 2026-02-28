import { E_MESSAGE_ROLE } from "@/enums";

export type MessageItemType = {
  id: string;
  content: string;
  conversation_id: string;
  created_at: string;
  role: E_MESSAGE_ROLE;
  user_id: string;
}
