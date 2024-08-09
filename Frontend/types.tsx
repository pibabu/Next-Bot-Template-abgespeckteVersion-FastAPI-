
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'| 'data';
  content: string;
}