import React, { useState } from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatHeader } from './ChatHeader';
import { ChatArea } from './ChatArea';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isSent: boolean;
  isRead?: boolean;
  isDelivered?: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing today?',
    timestamp: '10:30 AM',
    sender: { id: '2', name: 'Sarah Johnson', avatar: '/placeholder.svg' },
    isSent: false,
    isDelivered: true,
    isRead: true,
  },
  {
    id: '2',
    content: 'I\'m doing great, thanks! Just working on some new designs. How about you?',
    timestamp: '10:32 AM',
    sender: { id: '1', name: 'You' },
    isSent: true,
    isDelivered: true,
    isRead: true,
  },
  {
    id: '3',
    content: 'That sounds exciting! I\'d love to see them when you\'re ready to share.',
    timestamp: '10:33 AM',
    sender: { id: '2', name: 'Sarah Johnson', avatar: '/placeholder.svg' },
    isSent: false,
    isDelivered: true,
    isRead: true,
  },
  {
    id: '4',
    content: 'Absolutely! I\'ll send them over later today. They\'re for the new chat app project we discussed.',
    timestamp: '10:35 AM',
    sender: { id: '1', name: 'You' },
    isSent: true,
    isDelivered: true,
    isRead: false,
  },
];

export function ChatApp() {
  const [selectedChatId, setSelectedChatId] = useState('1');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: { id: '1', name: 'You' },
      isSent: true,
      isDelivered: false,
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate delivery and read status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, isRead: true } : msg
      ));
    }, 2000);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "relative z-50 transition-transform duration-300",
        isMobile ? "fixed inset-y-0 left-0" : "relative",
        isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
      )}>
        <ChatSidebar onChatSelect={handleChatSelect} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header with menu button */}
        {isMobile && (
          <div className="flex items-center p-4 border-b border-border bg-card">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-3"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Messages</h1>
          </div>
        )}

        {selectedChatId ? (
          <>
            <ChatHeader 
              chatName="Sarah Johnson"
              isOnline={true}
              avatar="/placeholder.svg"
            />
            <ChatArea messages={messages} />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Welcome to Chat
              </h3>
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}