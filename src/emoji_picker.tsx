import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import "./emoji_picker.css";
import "@/index.css";
import { useWebSocketStore } from "./lib/websocket-service";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  const handleHide = () => {
    invoke("hide_picker_window").catch((err: Error) => {
      console.error("Failed to hide window using Tauri command:", err);
    });
  };

  return (
    <div className="emoji-picker">
      <div data-tauri-drag-region className="drag-region"></div>
      <div className="w-full flex items-center justify-between py-2 pr-2 text-white select-none text-sm md:hidden">
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
            <span className="font-medium flex items-center">{status}</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="text-xs font-medium">Received: {receivedCount}</div>
        </div>
        <Button
          onClick={handleHide}
          variant="ghost"
          className="hover:bg-red-500/50 hover:text-white">
          <X />
        </Button>
      </div>
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        theme={Theme.DARK}
        width={"100%"}
        height={490}
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
