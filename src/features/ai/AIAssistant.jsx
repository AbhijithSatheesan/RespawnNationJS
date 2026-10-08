import React, { useState } from "react";
import AIButton from "./AIButton";
import AIChatWindow from "./AIChatWindow";

const AIAssistant = () => {
  const [isOpen, setIsOpen] =
    useState(false);

  const [buttonPosition, setButtonPosition] =
    useState({
      x: window.innerWidth - 78,
      y: window.innerHeight - 78,
    });

  return (
    <>
      {!isOpen && (
        <AIButton
          position={buttonPosition}
          setPosition={setButtonPosition}
          onClick={() => setIsOpen(true)}
        />
      )}

      {isOpen && (
        <AIChatWindow
          buttonPosition={buttonPosition}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AIAssistant;