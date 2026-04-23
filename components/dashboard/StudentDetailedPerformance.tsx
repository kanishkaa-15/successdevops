'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Calendar,
    BookOpen,
    Award,
    UserCheck,
    ArrowUpRight,
    Loader2
} from 'lucide-react'
import { API_URL } from '@/lib/api-config'
import { Button } from '@/components/ui/button'

interface StudentDetailedPerformanceProps {
    studentName: string
    studentId?: string
    language?: 'en' | 'ta'
}

const translations = {
    en: {
        overallAttendance: "Overall Attendance",
        excellent: "Excellent",
        good: "Good",
        needsReview: "Needs Review",
        sessionsAttended: "sessions attended",
        assessments: "Assessments",
        totalTests: "Total tests this term",
        subjectProf: "Subject Proficiency",
        noAssessment: "No assessment data available yet.",
        recentGrades: "Recent Grades",
        score: "Score",
        noGrades: "No grades recorded recently.",
        genReport: "Generating Report...",
        viewReport: "View Full Report Card",
        aiForecast: "AI Academic Forecast",
        predictiveDesc: "Predictive analysis based on recent performance momentum",
        projected: "Projected",
        current: "Current",
        delta: "Delta",
        collectingData: "Collecting more data points to generate accurate predictions...",
        ceoInsight: "CEO Insight",
        showing: "is showing",
        positive: "positive",
        variable: "variable",
        momentum: "momentum in core subjects. Intervention in",
        couldMaximize: "could maximize the final term result."
    },
    ta: {
        overallAttendance: "ஒட்டுமொத்த வருகை",
        excellent: "மிக நன்று",
        good: "நன்று",
        needsReview: "கவனம் தேவை",
        sessionsAttended: "அமர்வுகள் கலந்து கொள்ளப்பட்டன",
        assessments: "மதிப்பீடுகள்",
        totalTests: "இந்த காலாண்டில் மொத்த தேர்வுகள்",
        subjectProf: "பாடத் தேர்ச்சி",
        noAssessment: "மதிப்பீட்டுத் தரவு இன்னும் கிடைக்கவில்லை.",
        recentGrades: "சமீபத்திய மதிப்பெண்கள்",
        score: "மதிப்பெண்",
        noGrades: "சமீபத்தில் மதிப்பெண்கள் எதுவும் பதிவு செய்யப்படவில்லை.",
        genReport: "அறிக்கை உருவாக்கப்படுகிறது...",
        viewReport: "முழு அறிக்கை அட்டையைக் காண்க",
        aiForecast: "AI கல்வி கணிப்பு",
        predictiveDesc: "சமீபத்திய செயல்திறன் வேகத்தின் அடிப்படையில் முன்கணிப்பு பகுப்பாய்வு",
        projected: "கணிக்கப்பட்டது",
        current: "தற்போதைய",
        delta: "மாற்றம்",
        collectingData: "துல்லியமான கணிப்புகளை உருவாக்க கூடுதல் தரவுப் புள்ளிகள் சேகரிக்கப்படுகின்றன...",
        ceoInsight: "தலைமை அதிகாரி நுண்ணறிவு",
        showing: "",
        positive: "நேர்மறையான",
        variable: "மாறக்கூடிய",
        momentum: "வேகத்தை முக்கிய பாடங்களில் காட்டுகிறார். தலையீடு",
        couldMaximize: "இறுதி பருவ முடிவை அதிகரிக்கலாம்."
    }
}

export default function StudentDetailedPerformance({ studentName, studentId, language = 'en' }: StudentDetailedPerformanceProps) {
    const t = translations[language]
    const [attendance, setAttendance] = useState<any[]>([])
    const [grades, setGrades] = useState<any[]>([])
    const [projections, setProjections] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const identifier = studentId || studentName
                const encodedIdentifier = encodeURIComponent(identifier)
                const isId = !!studentId

                const apiUrl = API_URL
                const token = localStorage.getItem('token')

                // Construct endpoints based on whether we have an ID or Name
                const attendanceUrl = isId ? `${apiUrl}/attendance/id/${encodedIdentifier}` : `${apiUrl}/attendance/${encodedIdentifier}`
                const gradesUrl = isId ? `${apiUrl}/grades/id/${encodedIdentifier}` : `${apiUrl}/grades/${encodedIdentifier}`
                const projectionUrl = `${apiUrl}/analytics/predictions/grade-projection/${encodeURIComponent(studentName)}`

                const [attendanceRes, gradesRes, projectionRes] = await Promise.all([
                    fetch(attendanceUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(gradesUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(projectionUrl, { headers: { 'Authorization': `Bearer ${token}` } })
                ])

                if (!attendanceRes.ok || !gradesRes.ok) {
                    throw new Error('Failed to fetch student data')
                }

                const [attendanceData, gradesData] = await Promise.all([
                    attendanceRes.json(),
                    gradesRes.json()
                ])

                let projectionData = []
                if (projectionRes.ok) {
                    projectionData = await projectionRes.json()
                }

                setAttendance(attendanceData)
                setGrades(gradesData)
                setProjections(projectionData)
            } catch (error) {
                console.error('Error fetching student data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (studentName) {
            setLoading(true)
            fetchData()
        } else {
            setLoading(false)
        }
    }, [studentName])

    const handleDownloadFullReport = async () => {
        try {
            setIsDownloading(true)
            const token = localStorage.getItem('token')
            const identifier = studentId || studentName
            const queryParam = studentId ? `studentId=${identifier}` : `studentName=${encodeURIComponent(identifier)}`

            const response = await fetch(`${API_URL}/analytics/student-report?${queryParam}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to generate report (Status: ${response.status})`);
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Report_Card_${studentName.replace(/\s+/g, '_')}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error: any) {
            console.error('Download error details:', error)
            alert(`Download failed: ${error.message}`)
        } finally {
            setIsDownloading(false)
        }
    }

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
            </div>
        )
    }

    // Calculate stats
    const totalClasses = attendance.length
    const presentClasses = attendance.filter(a => a.status === 'Present').length
    const attendanceRate = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0

    // Group performance by subject
    const subjectStats = grades.reduce((acc: any, grade: any) => {
        if (!acc[grade.subject]) {
            acc[grade.subject] = { scores: [], latestGrade: grade.grade }
        }
        acc[grade.subject].scores.push(grade.score)
        return acc
    }, {})

    const performanceData = Object.keys(subjectStats).map(subject => {
        const scores = subjectStats[subject].scores
        const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        return {
            subject,
            score: Math.round(avgScore),
            attendance: 100,
            trend: '+0%',
            latestGrade: subjectStats[subject].latestGrade
        }
    })

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{t.overallAttendance}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-primary">{attendanceRate.toFixed(1)}%</span>
                                <Badge variant="outline" className="border-primary/20 text-primary font-bold">
                                    {attendanceRate >= 90 ? t.excellent : attendanceRate >= 75 ? t.good : t.needsReview}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {presentClasses} / {totalClasses} {t.sessionsAttended}
                            </p>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-black/20 rounded-2xl backdrop-blur-sm shadow-inner overflow-hidden relative group">
                            <UserCheck className="w-10 h-10 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 opacity-10">
                        <TrendingUp className="w-24 h-24 text-primary" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col justify-center"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.assessments}</p>
                    </div>
                    <h4 className="text-3xl font-black text-foreground">{grades.length}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{t.totalTests}</p>
                </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {t.subjectProf}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {performanceData.length > 0 ? performanceData.map((subject, idx) => (
                            <motion.div
                                key={subject.subject}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="space-y-1.5"
                            >
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-foreground tracking-tight">{subject.subject}</span>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] font-bold bg-primary/10 text-primary border-none">
                                            {subject.latestGrade}
                                        </Badge>
                                        <span className="font-black text-primary">{subject.score}%</span>
                                    </div>
                                </div>
                                <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${subject.score}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                        className={`absolute top-0 left-0 h-full rounded-full bg-primary/80`}
                                    />
                                </div>
                            </motion.div>
                        )) : (
                            <p className="text-center py-8 text-sm text-muted-foreground">{t.noAssessment}</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            {t.recentGrades}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {grades.slice(0, 4).map((grade, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                className="group flex items-center gap-4 bg-secondary/20 hover:bg-secondary/40 rounded-xl p-3 transition-all border border-transparent hover:border-border/50"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">
                                    {grade.grade}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-foreground text-sm leading-tight truncate">{grade.title}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground uppercase">{grade.subject}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">
                                        {new Date(grade.date).toLocaleDateString()}
                                    </p>
                                    <Badge variant="outline" className="text-[8px] font-bold px-1.5 py-0 border-primary/20 text-primary">{t.score}: {grade.score}</Badge>
                                </div>
                            </motion.div>
                        ))}
                        {grades.length === 0 && (
                            <p className="text-center py-8 text-sm text-muted-foreground">{t.noGrades}</p>
                        )}
                        <Button
                            disabled={isDownloading}
                            onClick={handleDownloadFullReport}
                            variant="ghost"
                            className="w-full mt-2 py-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all h-auto"
                        >
                            {isDownloading ? t.genReport : t.viewReport}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* AI Academic Forecast */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Award className="w-24 h-24 text-primary" />
                </div>
                <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-xl font-black flex items-center gap-2 text-primary">
                        <TrendingUp className="w-6 h-6" />
                        {t.aiForecast}
                    </CardTitle>
                    <CardDescription className="text-primary/70 font-medium">
                        {t.predictiveDesc}
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {projections.length > 0 ? projections.map((proj, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-primary/10"
                            >
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{proj.subject}</p>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-foreground">{proj.projected}%</span>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{t.projected}</span>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`text-[9px] font-black uppercase ${proj.trend === 'Improving' ? 'bg-green-500/10 text-green-600' :
                                            proj.trend === 'Declining' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                                            }`}
                                    >
                                        {proj.trend}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
                                        <span>{t.current}: {proj.current}%</span>
                                        <span>{t.delta}: {proj.projected - proj.current > 0 ? '+' : ''}{proj.projected - proj.current}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${proj.projected}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <p className="col-span-full text-center py-8 text-sm text-muted-foreground italic">
                                {t.collectingData}
                            </p>
                        )}
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-tight mb-1">{t.ceoInsight}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                "{studentName} {t.showing} {projections.filter(p => p.trend === 'Improving').length > projections.filter(p => p.trend === 'Declining').length ? t.positive : t.variable} {t.momentum} {projections.find(p => p.trend === 'Declining')?.subject || 'upcoming topics'} {t.couldMaximize}"
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
