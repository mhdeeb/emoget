// import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
// import { useState, useEffect } from "react";
import "./emoji_picker.css";

// const handleEmojiClick = (emoji: EmojiClickData) => {
//   //   sendMessage(emoji.emoji);
//   console.log(emoji.emoji);
// };

export default function EmojiPickerComponent() {
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   // Initial check
  //   checkMobile();

  //   // Listen for resize events
  //   window.addEventListener("resize", checkMobile);

  //   return () => {
  //     window.removeEventListener("resize", checkMobile);
  //   };
  // }, []);

  return (
    <div className="emoji-picker">
      Hello
      {/* <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={Theme.DARK}
        width={isMobile ? "100%" : 320}
        height={500}
      /> */}
    </div>
  );
}
