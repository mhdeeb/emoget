import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState, useEffect } from "react";

const handleEmojiClick = (emoji: EmojiClickData) => {
  //   sendMessage(emoji.emoji);
  console.log(emoji.emoji);
};

export default function EmojiPickerComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className="w-full md:w-auto">
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={Theme.DARK}
        width={isMobile ? "100%" : 320}
        height={isMobile ? 300 : 400}
      />
    </div>
  );
}
