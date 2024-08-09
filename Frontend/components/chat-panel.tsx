'use client'

import { type UseChatHelpers } from 'ai/react';
import { Button } from '@/components/ui/button';
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { IconRefresh, IconStop } from '@/components/ui/icons';


//
function generateUniqueId() {
  return `msg-${Math.random().toString(36).substr(2, 9)}`;}
//

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string;
  websocketRef: React.RefObject<WebSocket | null>; // Add websocketRef as a prop
  onSend: (value: string) => Promise<void>;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  websocketRef, // neu
  onSend,
}: ChatPanelProps) {
  const handleSendMessage = async () => {
    if (websocketRef.current && input) {
        // Send the message through WebSocket
        websocketRef.current.send(JSON.stringify({ message: input }));

        // Append the message to the chat
        await append({
            id: generateUniqueId(), // Unique ID for the message
            content: input, // Use the input as the message content
            role: 'user', // Set the role to 'user'
        });

        setInput(''); // Clear the input after sending
    }
};

  // const handleSendMessage = async (value: string) => {
  //   // Use existing append logic  -------noch ändern!
  //   await append({
  //     id,
  //     content: value,
  //     role: 'user',
  //   });

  //   // Send message via WebSocket
  //   if (websocketRef.current) {
  //     websocketRef.current.send(JSON.stringify({ message: value }));
  //   }

  //   // Clear the input after sending
  //   setInput('');
  // };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <div className="mb-1">
        <ButtonScrollToBottom />
      </div>
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center mb-1">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={onSend}      //{handleSendMessage} // noch checken.....yes!
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}