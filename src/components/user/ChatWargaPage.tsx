'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAppStore } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  MessageSquare, Send, Plus, ArrowLeft, Loader2,
  User, Clock, CheckCircle2
} from 'lucide-react'

interface ChatRoomData {
  id: string
  subject: string
  status: string
  admin: { id: string; name: string } | null
  updatedAt: string
  lastMessage: { message: string; sender: { name: string }; createdAt: string } | null
}

interface MessageData {
  id: string
  senderId: string
  message: string
  createdAt: string
  sender: { id: string; name: string }
}

export function ChatWargaPage() {
  const { user } = useAuthStore()
  const { setCurrentPage } = useAppStore()
  const { toast } = useToast()
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageData[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user?.id) fetchChatRooms()
  }, [user?.id])

  useEffect(() => {
    if (selectedRoom) fetchMessages()
    const interval = setInterval(() => {
      if (selectedRoom) fetchMessages()
    }, 3000)
    return () => clearInterval(interval)
  }, [selectedRoom])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchChatRooms = async () => {
    try {
      const res = await fetch(`/api/chat?wargaId=${user!.id}`)
      if (res.ok) {
        const data = await res.json()
        setChatRooms(data.chatRooms || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedRoom) return
    try {
      const res = await fetch(`/api/chat/${selectedRoom}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user?.id) return
    setSending(true)
    try {
      const res = await fetch(`/api/chat/${selectedRoom}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: user.id, message: newMessage.trim() }),
      })
      if (res.ok) {
        setNewMessage('')
        fetchMessages()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Gagal mengirim pesan', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const handleCreateChat = async () => {
    if (!user?.id || !newSubject.trim()) return
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wargaId: user.id, subject: newSubject.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setNewSubject('')
        setShowNewChat(false)
        fetchChatRooms()
        setSelectedRoom(data.chatRoom.id)
        toast({ title: 'Berhasil', description: 'Chat room berhasil dibuat' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Gagal membuat chat room', variant: 'destructive' })
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Login Diperlukan</h2>
        <p className="text-gray-500 mb-4">Silakan login terlebih dahulu untuk mengakses chat</p>
        <Button onClick={() => setCurrentPage('login')} className="bg-emerald-600 hover:bg-emerald-700">
          Login Sekarang
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="mb-6">
        <button
          onClick={() => selectedRoom ? setSelectedRoom(null) : setCurrentPage('dashboard-warga')}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedRoom ? 'Kembali ke Daftar Chat' : 'Kembali ke Dashboard'}
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          Chat dengan Admin Desa
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Chat Rooms List */}
        <div className={`lg:col-span-1 ${selectedRoom ? 'hidden lg:block' : ''}`}>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Percakapan</CardTitle>
                <Button size="sm" onClick={() => setShowNewChat(!showNewChat)} className="bg-emerald-600 hover:bg-emerald-700 h-8">
                  <Plus className="w-4 h-4 mr-1" /> Baru
                </Button>
              </div>
              {showNewChat && (
                <div className="mt-3 space-y-2">
                  <Input
                    placeholder="Subjek percakapan..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateChat()}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleCreateChat} className="flex-1 bg-emerald-600 hover:bg-emerald-700">Buat</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowNewChat(false)}>Batal</Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatRooms.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada percakapan</p>
                  <p className="text-xs text-gray-400 mt-1">Klik "+ Baru" untuk memulai</p>
                </div>
              ) : (
                chatRooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedRoom === room.id ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-gray-900 truncate flex-1">{room.subject}</p>
                      <Badge variant="outline" className={`text-xs ml-2 ${room.status === 'active' ? 'text-green-600 border-green-200' : 'text-gray-400 border-gray-200'}`}>
                        {room.status === 'active' ? 'Aktif' : 'Ditutup'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{room.lastMessage?.message || 'Belum ada pesan'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className={`lg:col-span-2 ${!selectedRoom ? 'hidden lg:block' : ''}`}>
          <Card className="h-full flex flex-col">
            {!selectedRoom ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">Pilih percakapan atau buat baru</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {chatRooms.find(r => r.id === selectedRoom)?.subject || 'Chat'}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {chatRooms.find(r => r.id === selectedRoom)?.admin?.name ? `Admin: ${chatRooms.find(r => r.id === selectedRoom)?.admin?.name}` : 'Menunggu admin'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Online
                    </Badge>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? 'bg-emerald-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}>
                          {!isOwn && (
                            <p className="text-xs font-medium text-emerald-600 mb-0.5">{msg.sender.name}</p>
                          )}
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-emerald-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ketik pesan..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      disabled={sending}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
