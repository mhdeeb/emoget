import { create } from 'zustand';

export type Emote = {
    id: string;
    userId: number;
    emoji: string;
    timestamp: number;
    startX: number;
    speed: number;
};

interface WebSocketState {
    socket: WebSocket | null;
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
    emotes: Emote[];
    receivedCount: number;
    connect: () => void;
    disconnect: () => void;
    sendEmote: (emoji: string) => void;
    addEmote: (userId: number, emoji: string, containerWidth: number, isMobile: boolean) => void;
    cleanupEmotes: (lifetime: number) => void;
    setMessageHandler: (handler: (userId: number, emoji: string) => void) => void;
}

const MAX_EMOTES = 1000;
const WS_URL = "wss://ws.mhdeeb.com/emotes";

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
    socket: null,
    status: 'disconnected',
    emotes: [],
    receivedCount: 0,

    connect: () => {
        if (get().socket) return;

        try {
            const socket = new WebSocket(WS_URL);

            set({ socket, status: 'connecting' });

            socket.onopen = () => {
                set({ status: 'connected' });
            };

            socket.onmessage = async (event: MessageEvent) => {
                const buffer = await event.data.arrayBuffer();
                const view = new Uint8Array(buffer);
                const userId = view[0];
                // const emote = view.slice(1);

                if (userId === 0) {
                    console.log("Emote sent");
                } else {
                    // const emoji = new TextDecoder().decode(emote);
                    set(state => ({ receivedCount: state.receivedCount + 1 }));
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                set({ status: 'error' });
            };

            socket.onclose = () => {
                set({ status: 'disconnected', socket: null });
            };
        } catch (error) {
            console.error("WebSocket connection error:", error);
            set({ status: 'error' });
        }
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null, status: 'disconnected' });
        }
    },

    sendEmote: (emoji: string) => {
        const { socket, status } = get();
        if (socket && status === 'connected') {
            const encoder = new TextEncoder();
            const emoteData = encoder.encode(emoji);

            socket.send(emoteData);

            const state = get();
            const containerWidth = 500;
            state.addEmote(0, emoji, containerWidth, false);
        } else {
            console.warn('Cannot send emoji: WebSocket not connected. Current state:', status);
        }
    },

    addEmote: (userId: number, emoji: string, containerWidth: number, isMobile: boolean) => {
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

        set((state) => {
            const newEmotes = [...state.emotes, newEmote];
            return {
                emotes: newEmotes.length > MAX_EMOTES
                    ? newEmotes.slice(-MAX_EMOTES)
                    : newEmotes
            };
        });
    },

    cleanupEmotes: (lifetime: number) => {
        const now = Date.now();
        set((state) => ({
            emotes: state.emotes.filter((emote) => now - emote.timestamp < lifetime)
        }));
    },

    setMessageHandler: (handler: (userId: number, emoji: string) => void) => {
        const { socket } = get();
        if (socket) {
            // const originalHandler = socket.onmessage;

            socket.onmessage = async (event: MessageEvent) => {
                const buffer = await event.data.arrayBuffer();
                const view = new Uint8Array(buffer);
                const userId = view[0];
                const emote = view.slice(1);

                if (userId === 0) {
                    console.log("Emote sent");
                } else {
                    set(state => ({ receivedCount: state.receivedCount + 1 }));
                    const emoji = new TextDecoder().decode(emote);
                    handler(userId, emoji);
                }
            };
        }
    }
})); 