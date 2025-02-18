"use client"; 

import Image from "next/image"; 
import diuGPTLogo from "./assests/diu_chatbot_logo.png";
import { useChat } from "ai/react";  
import { Message } from "ai"; 

const Home = () => {
    return (
        <main>
            <Image src={diuGPTLogo} alt="DIU GPT Logo" width={250} />     
        </main>
    );
};

export default Home;
