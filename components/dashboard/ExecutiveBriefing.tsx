'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Sparkles, AlertCircle, TrendingUp, Zap, Target } from 'lucide-react'

export default function ExecutiveBriefing() {
    const briefings = [
        {
            id: 'vitality',
            title: 'Institutional Vitality',
            content: 'System stress is down 5%. Staff burnout risks remain high in Math/Science departments. Intervention suggested.',
            status: 'Critical',
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            icon: Zap
        },
        {
            id: 'growth',
            title: 'Growth Vector',
            content: 'Predicted enrollment for next cycle is +15% based on current query velocity and seasonal trends.',
            status: 'Optimal',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            icon: TrendingUp
        },
        {
            id: 'sentiment',
            title: 'Stakeholder Trust',
            content: 'Sentiment has shifted to "Positive" following recent facility upgrades. Parent engagement is at an all-time high.',
            status: 'Improving',
            color: 'text-primary',
            bg: 'bg-primary/10',
            icon: Target
        }
    ]

    return (
        <Card className="bg-slate-950 border-white/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50 pointer-events-none" />

            <CardContent className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl border border-primary/20 shadow-lg shadow-primary/10">
                            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Quantum Executive Briefing</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-60 mt-1">AI-Synthesized Institutional Status</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                        Neural Engine Active
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {briefings.map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.id}
                            className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/item overflow-hidden relative"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${item.color} ${item.bg} border-none`}>
                                    {item.status}
                                </Badge>
                            </div>
                            <h4 className="text-xs font-black uppercase text-white tracking-widest mb-2 group-hover/item:text-primary transition-colors">{item.title}</h4>
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                                "{item.content}"
                            </p>

                            {/* Decorative element */}
                            <div className={`absolute bottom-[-10%] right-[-10%] w-20 h-20 ${item.color} opacity-0 group-hover/item:opacity-5 blur-[40px] transition-opacity`} />
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
