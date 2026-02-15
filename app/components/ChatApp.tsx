"use client";
import { useEffect, useState, useRef } from "react";

// Define message type to match backend payload
type Message = {
  sender: "me" | "them" | "system";
  name?: string;
  text: string;
};

export default function ChatApp() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://chatappbackend-rpft.onrender.com");
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "update_users") {
          setUserCount(data.count);
        } else if (data.sender) {
          // It's a chat message
          setMessages((prev) => [
            ...prev,
            {
              sender: data.sender,
              name: data.name,
              text: data.text,
            },
          ]);
        }
      } catch (e) {
        // Fallback for system strings like "Successfully Joined"
        setMessages((prev) => [
          ...prev,
          { sender: "system", text: event.data },
        ]);
      }
    };

    return () => socket.close();
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const joinRoom = () => {
    if (roomId && username && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "join",
          payload: { roomId, name: username }, // Added name to payload
        }),
      );
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "chat",
          payload: { roomId, chat: message, name: username }, // Added name to payload
        }),
      );
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono">
      {!joined ? (
        <div className="border border-zinc-800 p-8 rounded-lg bg-zinc-950 w-full max-w-md shadow-2xl">
          <h2 className="text-xl mb-6 text-center tracking-tighter">
            JOIN TERMINAL
          </h2>
          <div className="space-y-4">
            <input
              className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded outline-none focus:border-white transition-all"
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded outline-none focus:border-white transition-all"
              placeholder="Room Code (e.g. ALPHA-1)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button
              onClick={joinRoom}
              disabled={!username || !roomId}
              className="w-full bg-white text-black py-3 rounded font-bold hover:bg-zinc-200 disabled:opacity-50"
            >
              Enter Room
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <div>
              <h1 className="text-lg flex items-center gap-2 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Real Time Chat
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase">
                Active Session / Encrypted
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-400">
                User: <span className="text-white">{username}</span>
              </p>
              <p className="text-[10px] text-zinc-500">
                ID:{" "}
                {socketRef.current?.readyState === 1 ? "CONNECTED" : "OFFLINE"}
              </p>
            </div>
          </div>

          <div className="p-2 px-4 bg-zinc-900 flex justify-between text-[10px] text-zinc-400 border-b border-zinc-800">
            <span>
              ROOM: <span className="text-white">{roomId}</span>
            </span>
            <span>USERS_ONLINE: {userCount}</span>
          </div>

          <div
            ref={scrollRef}
            className="h-112.5 overflow-y-auto p-4 flex flex-col gap-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "me" ? "items-end" : msg.sender === "system" ? "items-center" : "items-start"}`}
              >
                {msg.sender !== "system" && (
                  <span className="text-[10px] text-zinc-500 mb-1 px-1">
                    {msg.sender === "me" ? "YOU" : msg.name || "ANON"}
                  </span>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                    msg.sender === "me"
                      ? "bg-white text-black rounded-tr-none"
                      : msg.sender === "system"
                        ? "bg-zinc-800/50 text-zinc-400 italic text-[10px] border border-zinc-700"
                        : "bg-zinc-800 text-white rounded-tl-none border border-zinc-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-800 flex gap-2 bg-zinc-950">
            <input
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm outline-none focus:border-zinc-500 transition-all"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:scale-105 active:scale-95 transition-all text-sm"
            >
              SEND
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
