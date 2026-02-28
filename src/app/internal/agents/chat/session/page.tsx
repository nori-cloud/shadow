'use client'

import { useCallback, useEffect, useState } from 'react'
import { Database, Trash2, Eye, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'

type Thread = {
  id: string
  title?: string
  createdAt: string
  updatedAt: string
}

type Message = {
  role: string
  text: string
}

const STALE_DAYS = 7

function isStale(updatedAt: string): boolean {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - STALE_DAYS)
  return new Date(updatedAt) < cutoff
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hr ago`
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function SessionsPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingStale, setDeletingStale] = useState(false)

  // View dialog state
  const [viewThread, setViewThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)

  // Delete confirm dialog state
  const [confirmThread, setConfirmThread] = useState<Thread | null>(null)
  const [confirmStaledays, setConfirmStaledays] = useState<number | null>(null)

  const fetchThreads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setThreads(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  const openViewDialog = async (thread: Thread) => {
    setViewThread(thread)
    setMessages([])
    setMessagesLoading(true)
    try {
      const res = await fetch(`/api/sessions/${thread.id}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } finally {
      setMessagesLoading(false)
    }
  }

  const deleteThread = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
      setThreads(prev => prev.filter(t => t.id !== id))
    } finally {
      setDeletingId(null)
      setConfirmThread(null)
    }
  }

  const deleteStale = async (days: number) => {
    setDeletingStale(true)
    try {
      const res = await fetch(`/api/sessions?days=${days}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.deleted > 0) await fetchThreads()
    } finally {
      setDeletingStale(false)
      setConfirmStaledays(null)
    }
  }

  const staleCount = threads.filter(t => isStale(t.updatedAt)).length

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sessions</h1>
              <p className="text-xs text-muted-foreground">Mastra memory threads</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              {loading ? <Spinner className="h-3 w-3" /> : `${threads.length} session${threads.length !== 1 ? 's' : ''}`}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={deletingStale} className="gap-1.5">
                  {deletingStale ? <Spinner className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete Stale
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Older than</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[7, 14, 30].map(days => (
                  <DropdownMenuItem key={days} onClick={() => setConfirmStaledays(days)}>
                    {days} days
                    {days === 7 && staleCount > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {staleCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="h-6 w-6 text-muted-foreground" />
            </div>
          ) : threads.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-muted-foreground">
              <Database className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">No sessions found</p>
            </div>
          ) : (
            threads.map(thread => {
              const stale = isStale(thread.updatedAt)
              return (
                <div
                  key={thread.id}
                  className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">{thread.id.slice(0, 8)}…</span>
                        {stale && (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            STALE
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created {formatDate(thread.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last active {timeAgo(thread.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openViewDialog(thread)}>
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setConfirmThread(thread)}
                        disabled={deletingId === thread.id}
                      >
                        {deletingId === thread.id ? (
                          <Spinner className="h-3.5 w-3.5" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* View messages dialog */}
      <Dialog open={!!viewThread} onOpenChange={open => !open && setViewThread(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm">
              Session {viewThread?.id.slice(0, 8)}…
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-80 pr-4">
            {messagesLoading ? (
              <div className="flex h-full items-center justify-center">
                <Spinner className="h-5 w-5 text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No messages</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-0.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs font-medium capitalize text-muted-foreground">{msg.role}</span>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {msg.text || <span className="italic text-muted-foreground">(empty)</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewThread(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete single session confirm */}
      <Dialog open={!!confirmThread} onOpenChange={open => !open && setConfirmThread(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete session?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove the session and all its messages.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmThread(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmThread && deleteThread(confirmThread.id)}
              disabled={!!deletingId}
            >
              {deletingId ? <Spinner className="h-4 w-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete stale confirm */}
      <Dialog open={confirmStaledays !== null} onOpenChange={open => !open && setConfirmStaledays(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete stale sessions?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove all sessions inactive for more than{' '}
            <strong>{confirmStaledays} days</strong> and all their messages.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmStaledays(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmStaledays !== null && deleteStale(confirmStaledays)}
              disabled={deletingStale}
            >
              {deletingStale ? <Spinner className="h-4 w-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
