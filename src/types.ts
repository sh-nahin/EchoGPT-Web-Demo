export type ModelId =
  | 'echo'
  | 'gpt'
  | 'claude'
  | 'gemini'
  | 'deepseek'
  | 'llama';
export interface Model {
  id: ModelId;
  name: string;
  provider: string;
  description: string;
  mark: string;
  color: string;
}
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: ModelId;
}
export interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
}
export interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  model: ModelId;
}
