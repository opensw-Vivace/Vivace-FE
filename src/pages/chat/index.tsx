import React, { useState } from "react";
import axios from "axios";

type Message = {
  sender: "user" | "bot";
  content: string;
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  // 추가: 사용자 정보
  const [name, setName] = useState<string>("민주");
  const [role, setRole] = useState<string>("front");
  const [step, setStep] = useState<string>("회원가입 시 ERD 수정");

  const addBotMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", content: message },
    ]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (userInput.trim() === "") {
      return; // 빈 입력 방지
    }
    const newUserMessage: Message = {
      sender: "user",
      content: userInput,
    };

    setMessages([...messages, newUserMessage]);

    try {
      const response = await axios.post("/api/chat", {
        name,
        role,
        step,
        userInput,
      });

      const botResponse = response.data.message;
      addBotMessage(botResponse);
    } catch (error) {
      console.error("API 요청 오류:", error);
      addBotMessage("There was an error processing your request.");
    }

    setUserInput(""); // 입력 필드 초기화
  };

  return (
    <div className="flex items-center h-[100vh] flex-row mx-auto relative gap-12">
      <div className="w-96 h-[60vh] flex mx-auto rounded-lg flex-col relative bg-blue-300 overflow-auto">
        <div className="flex flex-col overflow-auto mb-24">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full items-center justify-${
                msg.sender === "user" ? "end" : "start"
              }`}
            >
              <div
                className={`p-2 my-1 max-w-3/4 flex border-none rounded-lg text-sm break-words ${
                  msg.sender === "user"
                    ? "self-end bg-yellow-400 text-black"
                    : "self-start bg-white text-black"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 absolute w-full bottom-0 mx-auto h-24 bg-white flex">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            className="flex p-2 mr-2 w-3/4 items-start border-none"
            placeholder="Type your message..."
          ></textarea>
          <button
            onClick={handleSubmit}
            className="border-none flex bg-yellow-400 items-center justify-center w-12 h-8 rounded-md mt-2 ml-5"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
