'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { API_URL } from '@/lib/api-config'
import { Users, Building, TrendingUp, Lightbulb, Loader2 } from 'lucide-react'

interface ForecastData {
  projectedAdmissions: number
  staffHiringNeeded: number
  expectedBudgetIncreasePercent: number
  strategicRecommendation: string
}

export default function ResourceForecast() {
  const [data, setData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_URL}/analytics/predictions/resource-forecast`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error('Failed to fetch resource forecast:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchForecast()
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border/50 h-full flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    )
  }

  if (!data) return null;

  return (
    <Card className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Resource Forecasting</CardTitle>
            <CardDescription>AI-driven capacity and budget predictions</CardDescription>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col justify-center border border-border/50 hover:border-emerald-500/30 transition-colors group relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Projected Enrollment</p>
            </div>
            <h4 className="text-3xl font-black text-foreground">{data.projectedAdmissions}</h4>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-none w-fit mt-2 text-[10px] font-black uppercase">Expected Next Term</Badge>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col justify-center border border-border/50 hover:border-purple-500/30 transition-colors group relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-500" />
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Hiring Quota</p>
            </div>
            <h4 className="text-3xl font-black text-foreground">{data.staffHiringNeeded}</h4>
            <Badge className="bg-purple-500/10 text-purple-500 border-none w-fit mt-2 text-[10px] font-black uppercase">Open Positions</Badge>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded-2xl flex flex-col justify-center border border-border/50 hover:border-amber-500/30 transition-colors group relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Budget Variance</p>
            </div>
            <h4 className="text-3xl font-black text-foreground">+{data.expectedBudgetIncreasePercent}%</h4>
            <Badge className="bg-amber-500/10 text-amber-500 border-none w-fit mt-2 text-[10px] font-black uppercase">CapEx Estimate</Badge>
          </div>
        </div>
        
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-2 flex items-center gap-2">
            Strategic Recommendation
          </h4>
          <p className="text-sm font-medium text-foreground leading-relaxed italic pr-4">
            "{data.strategicRecommendation}"
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
