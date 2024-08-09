'use client'

// copying the message content to the clipboard, hover:
import { type Message } from '../types';

import { Button } from '@/components/ui/button'
import { IconCheck, IconCopy } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'


// ChatMessageActionsProps interface extends the React.ComponentProps<'div'> interface,
// which means it inherits all the props that a div element in React can accept:
interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
    message: Message
}

export function ChatMessageActions({
    message,
    className,
    ...props
}: ChatMessageActionsProps) {
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

    const onCopy = () => {
        if (isCopied) return
        copyToClipboard(message.content)
    }

    return (
        <div
            className={cn(
                'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
                className
            )}
            {...props}
        >
            <Button variant="ghost" size="icon" onClick={onCopy}>
                {isCopied ? <IconCheck /> : <IconCopy />}
                <span className="sr-only">Copy message</span>
            </Button>
        </div>
    )
}