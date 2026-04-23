'use client'

import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useData } from '@/context/DataContext'

export default function NotificationBell() {
  const { notifications, markNotificationRead, markAllRead } = useData()

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'error': return <XCircle className="w-4 h-4 text-rose-500" />
      default: return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-slate-400" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] border-none animate-pulse rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-slate-950/90 backdrop-blur-xl border-slate-800 rounded-3xl p-2 pb-4 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-3 border-b border-white/5 mb-2">
          <h4 className="font-black tracking-tighter text-white uppercase italic text-sm">System Alerts</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-6 px-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary hover:bg-primary/10 rounded-xl">
              <Check className="w-3 h-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
              <Bell className="w-8 h-8 mb-2 opacity-20" />
              <p className="text-[10px] uppercase font-black tracking-widest opacity-50">No new alerts</p>
            </div>
          ) : (
            <div className="space-y-1 pr-3 pl-1">
              {notifications.map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`flex gap-3 p-3 rounded-2xl cursor-pointer transition-all ${notif.read ? 'bg-transparent hover:bg-white/5 opacity-60' : 'bg-white/5 hover:bg-white/10 border border-white/5 shadow-sm'}`}
                >
                  <div className="mt-0.5">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black truncate uppercase ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>{notif.title}</p>
                    <p className={`text-[10px] font-medium leading-snug line-clamp-2 mt-0.5 ${notif.read ? 'text-slate-500' : 'text-slate-400'}`}>{notif.message}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1.5">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
