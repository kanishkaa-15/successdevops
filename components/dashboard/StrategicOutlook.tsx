'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import {
    TrendingUp, TrendingDown, Activity, Users,
    GraduationCap, Calendar, Download, RefreshCw
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_URL } from '@/lib/api-config'
import { useToast } from '@/hooks/use-toast'

export default function StrategicOutlook() {
    const { toast } = useToast()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)

    const fetchOutlook = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_URL}/analytics/annual-outlook`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const result = await response.json()
                setData(result)
            }
        } catch (error) {
            console.error('Failed to fetch annual outlook:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOutlook()
    }, [])

    const handleGenerateReport = async () => {
        setIsGenerating(true)
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${API_URL}/analytics/generate-report`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                toast({
                    title: "Strategic Report Generated",
                    description: "Your annual executive summary is ready for download in the logs.",
                })
            }
        } catch (error) {
            toast({
                title: "Generation Failed",
                description: "Could not generate report at this time.",
                variant: "destructive"
            })
        } finally {
            setIsGenerating(false)
        }
    }

    if (loading || !data) {
        return (
            <Card className="bg-slate-950 border-white/10 h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compiling Strategic Outlook...</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="bg-slate-950 border-white/10 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-white/5 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Quantum Intelligence</span>
                        </div>
                        <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Strategic Annual Outlook</CardTitle>
                        <CardDescription className="text-slate-400 font-medium">12-Month Dynamic Performance Velocity</CardDescription>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary transition-all disabled:opacity-50"
                    >
                        {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        Generate Exec PDF
                    </button>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 p-6">
                <Tabs defaultValue="academic" className="w-full">
                    <TabsList className="bg-white/5 border border-white/5 p-1 rounded-xl mb-6">
                        <TabsTrigger value="academic" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all rounded-lg">
                            Academic Trends
                        </TabsTrigger>
                        <TabsTrigger value="operations" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all rounded-lg">
                            Operational Velocity
                        </TabsTrigger>
                        <TabsTrigger value="enrollment" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all rounded-lg">
                            Growth Index
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="academic" className="h-[300px] mt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.academicTrend}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    domain={[50, 100]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 800, fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" name="Avg Proficiency" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="operations" className="h-[300px] mt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    domain={[80, 100]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 800, fontSize: '12px' }}
                                />
                                <Line type="stepAfter" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} name="Attendance %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="enrollment" className="h-[300px] mt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.enrollmentVelocity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    itemStyle={{ color: '#f59e0b', fontWeight: 800, fontSize: '12px' }}
                                />
                                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} name="New Enrollments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </TabsContent>
                </Tabs>

                {/* Dynamic Legend/Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Academic Vector</p>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-black text-white">+2.4% Momentum</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Attendance Stability</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm font-black text-white">94.2% Sustained</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Enrollment Cycle</p>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-black text-white">Target Reached</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
