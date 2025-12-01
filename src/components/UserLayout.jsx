import React, { useState } from "react";
import { MessageCircle, Mic, MicOff, X } from "lucide-react";
import Navbar from "./Navbar";
import Chatbot from "./Chatbot";

const UserLayout = ({ children, onLogout }) => {
  const [isListening, setIsListening] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar onLogout={onLogout} />
      <main className="p-6">{children}</main>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-4 max-w-lg w-full mx-4 relative text-foreground">
            <button
              onClick={() => setShowChatbot(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>
            <Chatbot />
          </div>
        </div>
      )}

      {/* ChatbotVoiceButtons - Always visible floating buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Voice Assistant Button */}
        <button
          onClick={() => {
            setIsListening(!isListening);
            if (!isListening) {
              console.log("Voice Assistant activated - Start listening");
            } else {
              console.log("Voice Assistant deactivated - Stop listening");
            }
          }}
          className={`w-14 h-14 ${
            isListening 
              ? "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600" 
              : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
          } text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 ${
            isListening 
              ? "focus:ring-red-300" 
              : "focus:ring-blue-300"
          } focus:ring-opacity-50 sm:w-12 sm:h-12`}
          aria-label={isListening ? "Stop Listening" : "Voice Assistant"}
          title={isListening ? "Stop Listening" : "Voice Assistant"}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 sm:h-5 sm:w-5" />
          ) : (
            <Mic className="h-6 w-6 sm:h-5 sm:w-5" />
          )}
        </button>

        {/* Chatbot Button */}
        <button
          onClick={() => setShowChatbot(true)}
          className="w-14 h-14 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 sm:w-12 sm:h-12"
          aria-label="Chatbot"
          title="Chatbot"
        >
          <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
};

export default UserLayout;