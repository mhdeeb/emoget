import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import "./emoji_picker.css";
import "@/index.css";
import { useWebSocketStore } from "./lib/websocket-service";

export default function EmojiPickerComponent() {
  const { sendEmote } = useWebSocketStore();

  const handleEmojiClick = (emoji: EmojiClickData) => {
    sendEmote(emoji.emoji);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendEmote(event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  return (
    <div className="emoji-picker">
      <div data-tauri-drag-region className="drag-region"></div>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={Theme.DARK}
        width={"100%"}
        height={543}
      />
      <Input
        className="w-full"
        name="emoji"
        type="text"
        placeholder="send message"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
