"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Send,
  Plus,
  MessageCircle,
  Search,
  X,
  Loader2,
  Wifi,
  WifiOff,
  User,
} from "lucide-react";

interface ChatRoom {
  id: string;
  wargaId: string;
  adminId: string | null;
  subject: string;
  status: string;
  createdAt: string;
  warga: { id: string; name: string; username: string };
  admin: { id: string; name: string } | null;
  messages?: ChatMessage[];
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

export function ChatWargaManager() {
  const { toast } = useToast();
  const { user, token } = useAuthStore();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [newRoomDialog, setNewRoomDialog] = useState(false);
  const [newRoomSubject, setNewRoomSubject] = useState("");
  const [newRoomWargaId, setNewRoomWargaId] = useState("");
  const [wargaList, setWargaList] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [mobileShowRooms, setMobileShowRooms] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Fetch rooms
  const fetchRooms = useCallback(() => {
    fetch("/api/chat?status=active")
      .then((r) => r.json())
      .then((d) => setRooms(d.rooms || d.chatRooms || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch messages for a room
  const fetchMessages = useCallback((roomId: string) => {
    fetch(`/api/chat/${roomId}`)
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        if (d.room) setSelectedRoom(d.room);
      })
      .catch(() => {});
  }, []);

  // Fetch warga list for new room
  const fetchWargaList = useCallback(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) =>
        setWargaList((d.users || []).filter((u: any) => u.role === "warga")),
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchWargaList();
  }, [fetchRooms, fetchWargaList]);

  useEffect(() => {
    if (selectedRoom) fetchMessages(selectedRoom.id);
  }, [selectedRoom?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!user) return;
    let socket: any = null;

    const connectSocket = async () => {
      try {
        const { io } = await import("socket.io-client");
        socket = io("/?XTransformPort=3003", {
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
          setWsConnected(true);
          socket.emit("authenticate", {
            userId: user.id,
            username: user.username,
            role: user.role,
          });
        });

        socket.on("disconnect", () => setWsConnected(false));

        socket.on("new-message", (data: any) => {
          console.log("NEW MESSAGE:", data);

          if (data.roomId === selectedRoom?.id) {
            setMessages((prev) => {
              const exists = prev.some((m) => m.id === data.id);
              if (exists) return prev;
              return [...prev, data];
            });
          }

          fetchRooms();

          // refresh otomatis
          if (selectedRoom?.id === data.roomId) {
            fetchMessages(data.roomId);
          }
        });

        socketRef.current = socket;
      } catch (err) {
        console.error("Socket connection error:", err);
      }
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [user?.id]);

  // Send message
  const handleSend = async () => {
    if (!messageInput.trim() || !selectedRoom) return;
    setSendingMsg(true);
    try {
      // Send via API
      const res = await fetch(`/api/chat/${selectedRoom.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: user?.id, message: messageInput }),
      });
      if (!res.ok) throw new Error();

      // Also emit via WebSocket for real-time
      if (socketRef.current) {
        socketRef.current.emit("send-message", {
          roomId: selectedRoom.id,
          senderId: user?.id,
          message: messageInput,
        });
        socketRef.current.emit("stop-typing", {
          roomId: selectedRoom.id,
          senderId: user?.id,
        });
      }

      setMessageInput("");
      fetchMessages(selectedRoom.id);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive",
      });
    } finally {
      setSendingMsg(false);
    }
  };

  // Handle typing
  const handleTyping = (value: string) => {
    setMessageInput(value);
    if (socketRef.current && selectedRoom) {
      socketRef.current.emit("typing", {
        roomId: selectedRoom.id,
        senderId: user?.id,
        senderName: user?.name,
      });
    }
  };

  // Create new room
  const handleCreateRoom = async () => {
    if (!newRoomWargaId || !newRoomSubject) {
      toast({
        title: "Error",
        description: "Pilih warga dan isi subjek",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wargaId: newRoomWargaId,
          subject: newRoomSubject,
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Berhasil", description: "Room chat berhasil dibuat" });
      setNewRoomDialog(false);
      setNewRoomSubject("");
      setNewRoomWargaId("");
      fetchRooms();
    } catch {
      toast({
        title: "Error",
        description: "Gagal membuat room chat",
        variant: "destructive",
      });
    }
  };

  // Close room
  const handleCloseRoom = async () => {
    if (!selectedRoom) return;
    try {
      await fetch(`/api/chat/${selectedRoom.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed", adminId: user?.id }),
      });
      toast({ title: "Berhasil", description: "Chat room ditutup" });
      fetchRooms();
      setSelectedRoom(null);
    } catch {
      toast({
        title: "Error",
        description: "Gagal menutup room",
        variant: "destructive",
      });
    }
  };

  // Take over room
  const handleTakeOver = async () => {
    if (!selectedRoom) return;
    try {
      await fetch(`/api/chat/${selectedRoom.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: user?.id }),
      });
      toast({ title: "Berhasil", description: "Anda mengambil alih chat ini" });
      fetchRooms();
      fetchMessages(selectedRoom.id);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengambil alih",
        variant: "destructive",
      });
    }
  };

  const filteredRooms = rooms.filter(
    (r) =>
      !searchRoom ||
      r.warga?.name?.toLowerCase().includes(searchRoom.toLowerCase()),
  );

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-0 rounded-xl overflow-hidden border dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
      {/* Room List Sidebar */}
      <div
        className={`${mobileShowRooms ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 lg:w-96 border-r dark:border-gray-800 bg-white dark:bg-gray-900`}
      >
        <div className="p-4 border-b dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              Chat Warga
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {filteredRooms.length}
              </Badge>
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${wsConnected ? "bg-emerald-500" : "bg-red-500"}`}
                title={wsConnected ? "Connected" : "Disconnected"}
              />
              <Button
                size="icon"
                className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setNewRoomDialog(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari warga..."
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Belum ada chat room
            </div>
          ) : (
            filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setMobileShowRooms(false);
                }}
                className={`w-full p-4 text-left border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedRoom?.id === room.id
                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {room.warga?.name || "Unknown"}
                      </p>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${room.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {room.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {room.subject}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div
        className={`${!mobileShowRooms ? "flex" : "hidden"} md:flex flex-col flex-1 bg-gray-50 dark:bg-gray-950`}
      >
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => {
                    setMobileShowRooms(true);
                    setSelectedRoom(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {selectedRoom.warga?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedRoom.subject}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!selectedRoom.adminId && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8"
                    onClick={handleTakeOver}
                  >
                    Ambil Alih
                  </Button>
                )}
                {selectedRoom.status === "active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCloseRoom}
                  >
                    Tutup
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-2xl mx-auto">
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMe
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md shadow-sm border dark:border-gray-700"
                        }`}
                      >
                        {!isMe && (
                          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                            {msg.sender?.name || "Warga"}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p
                          className={`text-[10px] mt-1 ${isMe ? "text-emerald-200" : "text-gray-400"}`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {typingUser && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm border dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {typingUser} sedang mengetik...
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            {selectedRoom.status === "active" ? (
              <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
                <div className="flex gap-2 max-w-2xl mx-auto">
                  <Input
                    placeholder="Ketik pesan..."
                    value={messageInput}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="flex-1"
                    disabled={sendingMsg}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={sendingMsg || !messageInput.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 px-4"
                  >
                    {sendingMsg ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-800 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chat room ini sudah ditutup
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto" />
              <p className="text-gray-500 dark:text-gray-400">
                Pilih chat room untuk mulai percakapan
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Room Dialog */}
      <Dialog open={newRoomDialog} onOpenChange={setNewRoomDialog}>
        <DialogContent className="dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              Chat Baru dengan Warga
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="dark:text-gray-300">Pilih Warga</Label>
              <select
                value={newRoomWargaId}
                onChange={(e) => setNewRoomWargaId(e.target.value)}
                className="w-full mt-1 h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm dark:text-white"
              >
                <option value="">-- Pilih Warga --</option>
                {wargaList.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="dark:text-gray-300">Subjek</Label>
              <Input
                value={newRoomSubject}
                onChange={(e) => setNewRoomSubject(e.target.value)}
                placeholder="Topik percakapan"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleCreateRoom}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Mulai Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
