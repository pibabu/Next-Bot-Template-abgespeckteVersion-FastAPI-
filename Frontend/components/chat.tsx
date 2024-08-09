'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { toast } from 'react-hot-toast';

import { cn } from '@/lib/utils';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { type Message } from '../types';

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[];
}

// Generate a unique ID for messages
function generateUniqueId() {
    return `msg-${Math.random().toString(36).substr(2, 9)}`; // Simple ID generator
}

export function Chat({ initialMessages, className }: ChatProps) {
    const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
        initialMessages,
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
    });

    const websocketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Create WebSocket connection
        const socket = new WebSocket('ws://localhost:8000/async_chat');

        socket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            const messageData = JSON.parse(event.data);
            append({ 
                id: generateUniqueId(),
                content: messageData.data, 
                role: 'system' 
            });
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        websocketRef.current = socket;

        // Cleanup function to close the WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, [append]); // Note: `append` is added as a dependency to ensure the latest function is used

    const handleSendMessage = async (value: string) => {
        if (websocketRef.current) {
            websocketRef.current.send(JSON.stringify({ message: value }));
            await append({
                id: generateUniqueId(),
                content: value,
                role: 'user',
            });
            setInput(''); // Clear input after sending
            
        } else {
            console.error('WebSocket is not open. Current state:', "kp");
        
        }
    };

    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
                {messages.length ? (
                    <>
                        <ChatList messages={messages} />
                        <ChatScrollAnchor trackVisibility={isLoading} />
                    </>
                ) : (
                    <></>
                )}
            </div>
            <ChatPanel
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
                websocketRef={websocketRef}
                onSend={handleSendMessage} // Pass the new send function
            />
        </>
    );
}