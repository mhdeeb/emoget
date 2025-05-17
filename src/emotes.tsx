import { useEffect, useRef, useState, useCallback } from "react";
import "./emotes.css";

const MAX_EMOTES = 1000;
const EMOJI_LIFETIME = 3 * 1000;

type Emote = {
  id: string;
  userId: number;
  emoji: string;
  timestamp: number;
  startX: number;
  speed: number;
};

export default function Emotes() {
  const wsRef = useRef<WebSocket | null>(null);
  const [emotes, setEmotes] = useState<Emote[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const cleanupEmotes = useCallback(() => {
    const now = Date.now();
    setEmotes((prev) =>
      prev.filter((emote) => now - emote.timestamp < EMOJI_LIFETIME)
    );

    setTimeout(cleanupEmotes, 100);
  }, []);

  useEffect(() => {
    cleanupEmotes();
    return () => {};
  }, [cleanupEmotes]);

  useEffect(() => {
    wsRef.current = new WebSocket("wss://ws.mhdeeb.com/emotes");

    wsRef.current.onmessage = async (event: MessageEvent) => {
      const buffer = await event.data.arrayBuffer();
      const view = new Uint8Array(buffer);
      const user = view[0];
      const emote = view.slice(1);

      if (user === 0) {
        console.log("Emote sent");
      } else {
        addNewEmote(user, new TextDecoder().decode(emote));
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const addNewEmote = useCallback(
    (userId: number, emoji: string) => {
      const containerWidth = containerRef.current?.clientWidth ?? 500;

      const margin = isMobile ? 20 : 40;
      const startX = margin + Math.random() * (containerWidth - margin * 2);
      const speed = 1.5 + (Math.random() - 0.5) * 1;

      const newEmote: Emote = {
        id: `${Date.now()}-${Math.random()}`,
        userId,
        emoji,
        timestamp: Date.now(),
        startX,
        speed,
      };

      setEmotes((prev) => {
        const newEmotes = [...prev, newEmote];
        return newEmotes.length > MAX_EMOTES
          ? newEmotes.slice(-MAX_EMOTES)
          : newEmotes;
      });
    },
    [isMobile]
  );

  return (
    <div className="emotes">
      <div ref={containerRef}>
        {emotes.map((emote) => (
          <div
            key={emote.id}
            className="emoji-animate"
            style={{
              left: `${emote.startX}px`,
              bottom: 0,
              zIndex: emote.userId === 0 ? 10 : 5,
              filter: "drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))",
              animationDuration: `${EMOJI_LIFETIME / emote.speed}ms`,
              animationPlayState: "running",
            }}>
            {emote.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
