"use client"; 

import Image from "next/image"; 
import diuGPTLogo from "./assests/diu_chatbot_logo.png";
import { useChat } from "ai/react";  
import { Message } from "ai";  
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PrommpSuggestionsRow from "./components/PrommpSuggestionsRow"


const Home = () => {
    const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat();

    const noMessages = true    
    return (
        <main>
            <Image src={diuGPTLogo} alt="DIU GPT Logo" width={250} />     
            <section className= {noMessages ? "" : "populated"}>
                {noMessages ? ( 
                    <>
                        <p className="starter-text">
                            Hello! I am DIU GPT. Ask me anything about Daffodil International University.
                            We hope you will find me helpful.
                        </p>
                        <br /> 
                        {/* <PrommpSuggestionsRow/> */}
                    </>

                ) : (
                    <>
                        {/* map messages onto text bubbles */}
                        {/* <LoadingBubble/> */}
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
