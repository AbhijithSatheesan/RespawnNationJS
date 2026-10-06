import React, { useState } from "react";
import AIButton from "./AIButton";
import AIChatWindow from "./AIChatWindow";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <AIButton onClick={() => setIsOpen(true)} />
      )}

      {isOpen && (
        <AIChatWindow onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default AIAssistant;