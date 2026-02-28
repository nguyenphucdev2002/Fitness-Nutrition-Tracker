"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Thinking,
} from "@/components/ui";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useAskAI, useGetAllMessages, useGetUserInfo } from "@/api/user/user.hook";
import { E_MESSAGE_ROLE } from "@/enums";
import dayjs from "dayjs";
import { MessageItemType } from "@/types/message.type";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";


export function AICoach() {
  const [messages, setMessages] = React.useState<MessageItemType[]>([]);
  const [input, setInput] = React.useState("");
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const { data: messageData } = useGetAllMessages();

  const { mutate: askAI, isPending } = useAskAI();

    const handleScrollToBottom = () => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    useEffect(() => {
      handleScrollToBottom();
    }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const userMessage: MessageItemType = {
      role: E_MESSAGE_ROLE.USER,
      content: input,
      created_at: new Date().toISOString(),
      conversation_id: '',
      id: uuidv4(),
      user_id: '',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    askAI(
      { message: currentInput },
      {
        onSuccess: (data) => {
          setMessages((prev) => [...prev, data]);
          handleScrollToBottom();
        },
        onError: () => {
          const errorMessage: MessageItemType = {
            role: E_MESSAGE_ROLE.AI,
            content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!",
            created_at: new Date().toISOString(),
            conversation_id: '',
            id: uuidv4(),
            user_id: '',
          };
          setMessages((prev) => [...prev, errorMessage]);
          handleScrollToBottom();
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "Hôm nay tôi nên ăn gì?",
    "Tôi có đang tiến bộ không?",
    "Làm sao để tăng cơ nhanh?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };


    useEffect(() => {
      if(messageData){
        setMessages(messageData);
      }
    }, [messageData]);

  return (
    <div className="overflow-hidden flex flex-col bg-white rounded-xl fixed bottom-0 right-0 left-0 top-[128px] mx-4 mb-4">
      {/* Chat Interface */}
      <Card className="flex h-[600px] flex-col overflow-hidden border-none gap-1">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5" />
            Trò chuyện với AI Coach
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 overflow-y-auto flex-col p-0">
          {/* Messages */}
          <div className="flex-1 px-6" ref={chatContainerRef}>
            <div className="space-y-4 py-4">
              {messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === E_MESSAGE_ROLE.USER ? "justify-end" : "justify-start"}`}
                >
                  {message.role === E_MESSAGE_ROLE.AI && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === E_MESSAGE_ROLE.USER ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap"> <ReactMarkdown>{message.content}</ReactMarkdown></p>
                    <p
                      className={`mt-1 text-xs ${
                        message.role === E_MESSAGE_ROLE.USER ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {dayjs(message.created_at).format("HH:mm")}
                    </p>
                  </div>
                  {message.role === E_MESSAGE_ROLE.USER && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />

              {isPending && (
                <Thinking />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
        <div className="border-t p-6 bg-white">
            {messages.length <= 4 && (
            <div className="">
              <p className="mb-1 text-sm text-muted-foreground">Câu hỏi gợi ý:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
            <div className="flex gap-2 mt-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={isPending}
              />
              <Button onClick={handleSend} disabled={isPending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
    </div>
  );
}
