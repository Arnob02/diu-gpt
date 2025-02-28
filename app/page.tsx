"use client"; 

import Image from "next/image"; 
import diuGPTLogo from "./assests/diu_chatbot_logo.png";
import { useState } from "react";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const noMessages = messages.length === 0;

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handlePrompt = async (promptText) => {
        setMessages([...messages, { role: "user", content: promptText }]);
        await sendMessage(promptText);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]); // Add user message to UI
        setInput("");

        await sendMessage(input);
    };

    async function sendMessage(userMessage) {
        setIsLoading(true);
    
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
        });
    
        if (!response.body) {
            console.error("No response body received");
            setIsLoading(false);
            return;
        }
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botMessage = ""; // Store AI response dynamically
    
        // Add a new assistant message placeholder
        setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "" }]);
    
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
    
            const chunk = decoder.decode(value);
            botMessage += chunk; // Append chunk to message
            
            // Live update the assistant message in the state
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                
                // Update the last assistant message
                if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === "assistant") {
                    updatedMessages[updatedMessages.length - 1].content = botMessage;
                }
                
                return updatedMessages;
            });
        }
    
        setIsLoading(false);
    }
    
    

    return (
        <main>
            <Image src={diuGPTLogo} alt="DIU GPT Logo" width={250} />     
            <section className={noMessages ? "" : "populated"}>
                {noMessages ? ( 
                    <>
                        <p className="starter-text">
                            Hello! I am DIU GPT. Ask me anything about Daffodil International University.
                            We hope you will find me helpful.
                        </p>
                        <br /> 
                        <PromptSuggestionsRow onPromptClick={handlePrompt}/>
                    </>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <Bubble key={`message-${index}`} message={message} />
                        ))}
                        {isLoading && <LoadingBubble />}
                    </>
                )}
            </section>

            <form onSubmit={handleSubmit}>
                <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask Me something..." />
                <input type="submit" />
            </form>
        </main>
    );
};

export default Home;
