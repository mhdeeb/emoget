import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import "./emoji_picker.css";
import "@/index.css";
import { useWebSocketStore } from "./lib/websocket-service";

export default function EmojiPickerComponent() {
  const { sendEmote, status, receivedCount } = useWebSocketStore();

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
      <div className="w-full flex items-center justify-between mb-2 text-white text-sm md:hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-sidebar-primary/20 rounded-lg">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "connected"
                  ? "bg-green-400"
                  : status === "connecting"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
            />
            <span className="text-xs font-medium text-white">{status}</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="text-xs font-medium text-white">
            Received: {receivedCount}
          </div>
        </div>
      </div>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={Theme.DARK}
        width={"100%"}
        height={500}
      />
      <Input
        name="emoji"
        type="text"
        placeholder="send message"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
