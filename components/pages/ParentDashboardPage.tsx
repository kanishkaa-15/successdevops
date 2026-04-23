'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  GraduationCap,
  LogOut,
  MessageSquare,
  TrendingUp,
  User,
  Bell,
  Calendar,
  Sparkles,
  Search,
  Send,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  CreditCard,
  FileDown,
  Languages
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useData, ParentQuery } from '@/context/DataContext'
import { useToast } from '@/hooks/use-toast'
import StudentDetailedPerformance from '@/components/dashboard/StudentDetailedPerformance'
import SchoolAnnouncements from '@/components/dashboard/SchoolAnnouncements'
import UpcomingEvents from '@/components/dashboard/UpcomingEvents'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { API_URL } from '@/lib/api-config'

interface ParentDashboardProps {
  onLogout: () => void
}

const translations = {
  en: {
    dashboard: "Parent Dashboard",
    portal: "Portal",
    activeStudent: "Active Student:",
    selectStudent: "Select Student",
    welcomeBack: "Welcome Back",
    empowering: "Empowering your child's",
    academicJourney: "academic journey.",
    stayUpdated: "Stay updated with real-time performance metrics, school announcements, and maintain direct communication with the faculty.",
    viewReports: "View Latest Reports",
    contactSupport: "Contact Support",
    overview: "Overview",
    performance: "Performance",
    reports: "Reports",
    admissions: "Admissions",
    academicGrowth: "Academic Growth Trend",
    performanceDesc: "Performance across all subjects over time",
    subjectComp: "Subject Comparison",
    aiInsights: "AI Insights",
    smartAdmissions: "Smart Admissions Tracker",
    admissionsDesc: "Real-time enrollment workflow tracking",
    appSubmitted: "Application Submitted",
    appSubmittedDesc: "Initial student data captured successfully.",
    autoCapture: "Automated Capture",
    appReviewed: "Application Reviewed",
    appReviewedDesc: "Staff has reviewed academic credentials.",
    submitQuery: "Submit Query",
    resolutionTarget: "Resolution target:",
    twentyFourHours: "24 Hours",
    subject: "Subject",
    subjectPlaceholder: "e.g. Leave Request, Progress Meeting",
    priorityLevel: "Priority Level",
    lowPriority: "Low Priority",
    mediumPriority: "Medium Priority",
    highPriority: "High Priority",
    detailedMessage: "Detailed Message",
    messagePlaceholder: "Provide details about your query...",
    sendQuery: "Send Query",
    commHistory: "Communication History",
    trackTickets: "Track active and archived tickets",
    tickets: "Tickets",
    parsingComm: "Parsing Communications...",
    noComm: "No active communications found",
    submitFirst: "Submit your first query using the panel above.",
    logout: "Logout",
    notificationsEnabled: "Notifications have been enabled for your browser!",
    admissionApproved: "Admission Approved",
    waitlistedStatus: "Waitlisted",
    appRejected: "Application Rejected",
    awaitingDecision: "Awaiting Final Decision",
    approvedMsg: "Congratulations! Please proceed to fee payment.",
    waitlistedMsg: "Added to waitlist pool due to capacity constraints.",
    rejectedMsg: "Sorry, we cannot offer a place at this time.",
    awaitingMsg: "School board is finalizing the enrollment capacity.",
    payFees: "Pay Enrollment Fees",
    viewDetails: "View Details",
    adminResponse: "Admin Response",
    createdOn: "Created on",
    originalMessage: "Original Message",
    officialAdminResponse: "Official Admin Response",
    reviewingMsg: "Our team is currently reviewing your message.",
    closeDetails: "Close Details",
    paymentGateway: "Secure Payment Gateway",
    cardDetails: "Card Details",
    cardName: "Name on Card",
    cardNumber: "16-Digit Card Number",
    expiry: "MM/YY",
    cvv: "CVV",
    payNow: "Pay Enrollment Fees",
    processing: "Processing Transaction...",
    paymentSuccess: "Transaction Successful!",
    enrollmentConfirmed: "Enrollment Confirmed",
    feePaid: "Fee Payment",
    paymentProcessingDesc: "Encrypting data. Please do not refresh.",
    successDesc: "Welcome to the academy! Your enrollment is complete.",
    amount: "Amount to Pay",
    feeAmount: "₹45,000",
    securePayment: "SSL Secure Connection"
  },
  ta: {
    dashboard: "பெற்றோர் டாஷ்போர்டு",
    portal: "போர்டல்",
    activeStudent: "செயலில் உள்ள மாணவர்:",
    selectStudent: "மாணவரை தேர்ந்தெடுக்கவும்",
    welcomeBack: "மீண்டும் வருக",
    empowering: "உங்கள் குழந்தையின்",
    academicJourney: "கல்விப் பயணத்தை மேம்படுத்துதல்.",
    stayUpdated: "நிகழ்நேர செயல்திறன் அளவீடுகள், பள்ளி அறிவிப்புகளுடன் புதுப்பித்த நிலையில் இருங்கள் மற்றும் ஆசிரியர்களுடன் நேரடி தொடர்பை பேணுங்கள்.",
    viewReports: "சமீபத்திய அறிக்கைகளைக் காண்க",
    contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
    overview: "கண்ணோட்டம்",
    performance: "செயல்திறன்",
    reports: "அறிக்கைகள்",
    admissions: "சேர்க்கைகள்",
    academicGrowth: "கல்வி வளர்ச்சிப் போக்கு",
    performanceDesc: "காலப்போக்கில் அனைத்து பாடங்களிலும் செயல்திறன்",
    subjectComp: "பாட ஒப்பீடு",
    aiInsights: "AI நுண்ணறிவுகள்",
    smartAdmissions: "ஸ்மார்ட் சேர்க்கை கண்காணிப்பான்",
    admissionsDesc: "நிகழ்நேர சேர்க்கை பணிப்பாய்வு கண்காணிப்பு",
    appSubmitted: "விண்ணப்பம் சமர்ப்பிக்கப்பட்டது",
    appSubmittedDesc: "ஆரம்ப மாணவர் தரவு வெற்றிகரமாகப் பிடிக்கப்பட்டது.",
    autoCapture: "தானியங்கி பிடிப்பு",
    appReviewed: "விண்ணப்பம் மதிப்பாய்வு செய்யப்பட்டது",
    appReviewedDesc: "பணியாளர்கள் கல்விச் சான்றுகளை மதிப்பாய்வு செய்துள்ளனர்.",
    submitQuery: "கேள்வியை சமர்ப்பிக்கவும்",
    resolutionTarget: "தீர்வு இலக்கு:",
    twentyFourHours: "24 மணிநேரம்",
    subject: "பொருள்",
    subjectPlaceholder: "உதாரணம்: விடுப்பு கோரிக்கை, முன்னேற்ற கூட்டம்",
    priorityLevel: "முன்னுரிமை நிலை",
    lowPriority: "குறைந்த முன்னுரிமை",
    mediumPriority: "நடுத்தர முன்னுரிமை",
    highPriority: "அதிக முன்னுரிமை",
    detailedMessage: "விரிவான செய்தி",
    messagePlaceholder: "உங்கள் கேள்வியைப் பற்றிய விவரங்களை வழங்கவும்...",
    sendQuery: "கேள்வியை அனுப்பு",
    commHistory: "தொடர்பு வரலாறு",
    trackTickets: "செயலில் உள்ள மற்றும் ஆவணப்படுத்தப்பட்ட டிக்கெட்டுகளைக் கண்காணிக்கவும்",
    tickets: "டிக்கெட்டுகள்",
    parsingComm: "தொடர்புகளை பகுப்பாய்வு செய்கிறது...",
    noComm: "செயலில் உள்ள தொடர்புகள் எதுவும் கண்டறியப்படவில்லை",
    submitFirst: "மேலே உள்ள பேனலைப் பயன்படுத்தி உங்கள் முதல் கேள்வியைச் சமர்ப்பிக்கவும்.",
    logout: "வெளியேறு",
    notificationsEnabled: "உங்கள் உலாவிக்காக அறிவிப்புகள் இயக்கப்பட்டுள்ளன!",
    admissionApproved: "சேர்க்கை அங்கீகரிக்கப்பட்டது",
    waitlistedStatus: "காத்திருப்பு பட்டியலில்",
    appRejected: "விண்ணப்பம் நிராகரிக்கப்பட்டது",
    awaitingDecision: "இறுதி முடிவிற்காக காத்திருக்கிறது",
    approvedMsg: "வாழ்த்துக்கள்! தயவுசெய்து கட்டணம் செலுத்த தொடரவும்.",
    waitlistedMsg: "கொள்ளளவு கட்டுப்பாடுகள் காரணமாக காத்திருப்பு பட்டியலில் சேர்க்கப்பட்டுள்ளது.",
    rejectedMsg: "மன்னிக்கவும், இந்த நேரத்தில் இடத்தை வழங்க முடியாது.",
    awaitingMsg: "பள்ளி வாரியம் சேர்க்கை திறனை இறுதி செய்கிறது.",
    payFees: "சேர்க்கை கட்டணத்தை செலுத்துங்கள்",
    viewDetails: "விவரங்களைக் காண்க",
    adminResponse: "நிர்வாகி பதில்",
    createdOn: "உருவாக்கப்பட்டது",
    originalMessage: "அசல் செய்தி",
    officialAdminResponse: "அதிகாரப்பூர்வ நிர்வாகி பதில்",
    reviewingMsg: "எங்கள் குழு தற்போது உங்கள் செய்தியை மதிப்பாய்வு செய்து வருகிறது.",
    closeDetails: "விவரங்களை மூடு",
    paymentGateway: "பாதுகாப்பான கட்டண நுழைவாயில்",
    cardDetails: "அட்டை விவரங்கள்",
    cardName: "அட்டையில் உள்ள பெயர்",
    cardNumber: "16-இலக்க அட்டை எண்",
    expiry: "மாதம்/ஆண்டு",
    cvv: "சி.வி.வி",
    payNow: "சேர்க்கை கட்டணத்தை செலுத்துங்கள்",
    processing: "பரிவர்த்தனை செயலாக்கப்படுகிறது...",
    paymentSuccess: "பரிவர்த்தனை வெற்றி!",
    enrollmentConfirmed: "சேர்க்கை உறுதி செய்யப்பட்டது",
    feePaid: "கட்டணக் கொடுப்பனவு",
    paymentProcessingDesc: "தரவு குறியாக்கம் செய்யப்படுகிறது. பக்கத்தை புதுப்பிக்க வேண்டாம்.",
    successDesc: "கல்விக்கூடத்திற்கு வரவேற்கிறோம்! உங்கள் சேர்க்கை முடிந்தது.",
    amount: "செலுத்த வேண்டிய தொகை",
    feeAmount: "₹45,000",
    securePayment: "SSL பாதுகாப்பான இணைப்பு"
  }
}

export default function ParentDashboardPage({ onLogout }: ParentDashboardProps) {
  const { toast } = useToast()
  const { queries: globalQueries, addQuery } = useData()
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [studentName, setStudentName] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [language, setLanguage] = useState<'en' | 'ta'>('en')
  const t = translations[language]
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [newQuery, setNewQuery] = useState({
    subject: '',
    message: '',
    priority: 'Medium'
  })
  const [selectedTicket, setSelectedTicket] = useState<ParentQuery | null>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'success'>('input')

  // Derive this parent's specific queries from the global context
  // Use case-insensitive matching and check email for robustness
  const queries = globalQueries.filter(q => {
    const nameMatch = q.studentName?.toLowerCase() === studentName?.toLowerCase()
    const emailMatch = q.email?.toLowerCase() === (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email?.toLowerCase() : '')
    return nameMatch || emailMatch
  })

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      const identifier = userData.name || userData.email

      if (userData.activeStudentId) {
        // Use student selected during login
        const student = {
          studentId: userData.activeStudentId,
          studentName: userData.activeStudentName || '' // Don't fallback to parent name here
        }
        setSelectedStudent(student)
        setStudentName(student.studentName)
        fetchPerformanceData(student.studentId, true)

        // Still fetch all students to populate secondary switcher if needed
        fetchParentStudents(identifier, userData.activeStudentId)
      } else {
        fetchParentStudents(identifier)
      }
    }
  }, [])

  const fetchParentStudents = async (parentIdentifier: string, preSelectedId?: string) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/admissions/parent/${encodeURIComponent(parentIdentifier)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setStudents(data)

      setStudents(data)

      if (data.length > 0 && !preSelectedId) {
        // Only auto-select if nothing was selected during login
        const first = data[0]
        setSelectedStudent(first)
        setStudentName(first.studentName)
        fetchPerformanceData(first.studentId || first.studentName, !!first.studentId)
      } else if (preSelectedId) {
        const selected = data.find((s: any) => s.studentId === preSelectedId)
        if (selected) {
          setSelectedStudent(selected)
          setStudentName(selected.studentName)
        }
      }
    } catch (error) {
      console.error('Error fetching parent students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student)
    setStudentName(student.studentName)
    fetchPerformanceData(student.studentId || student.studentName, !!student.studentId)
    // Optional: Reset tab or other state
  }

  const fetchPerformanceData = async (identifier: string, isId: boolean = false) => {
    if (!identifier) return
    try {
      const endpoint = isId ? `grades/id/${identifier}` : `grades/${encodeURIComponent(identifier)}`
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // Transform data for charts: Group by date/title
      const chartData = data.reduce((acc: any[], grade: any) => {
        const date = new Date(grade.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })
        let existing = acc.find(item => item.date === date)
        if (!existing) {
          existing = { date }
          acc.push(existing)
        }
        existing[grade.subject] = grade.score
        return acc
      }, [])

      setPerformanceData(chartData)
    } catch (error) {
      console.error('Error fetching performance data:', error)
    }
  }

  const handlePaymentSubmit = async () => {
    setIsProcessingPayment(true)
    setPaymentStep('processing')

    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/admissions/${selectedStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Paid' }),
      })

      if (response.ok) {
        const updated = await response.json()
        setSelectedStudent(updated)
        // Also update the students list locally
        setStudents(prev => prev.map(s => s._id === updated._id ? updated : s))
        setPaymentStep('success')

        toast({
          title: t.paymentSuccess,
          description: t.successDesc,
        })
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setPaymentStep('input')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const payload = {
        parentName: user.name,
        studentName: selectedStudent?.studentName || studentName,
        email: user.email,
        phone: 'N/A',
        subject: newQuery.subject,
        message: newQuery.message,
        priority: newQuery.priority,
        status: 'Open'
      }

      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/queries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const savedQuery = await response.json()
        // Inject into global context immediately for snappy UX
        // The backend `newQuery` socket event will handle pushing it to the Admin / CEO
        addQuery(savedQuery)
        setNewQuery({ subject: '', message: '', priority: 'Medium' })
      }
    } catch (error) {
      console.error('Error submitting query:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-100 text-emerald-800'
      case 'Open': return 'bg-amber-100 text-amber-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-amber-100 text-amber-800'
      case 'Low': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const handleDownloadReport = async (reportTitle: string) => {
    try {
      const doc = new jsPDF()
      const identifier = selectedStudent?.studentId || selectedStudent?.studentName
      const isId = !!selectedStudent?.studentId

      // Fetch latest data for report
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      const [attendanceRes, gradesRes] = await Promise.all([
        fetch(isId ? `${API_URL}/attendance/id/${identifier}` : `${API_URL}/attendance/${encodeURIComponent(identifier)}`, { headers }),
        fetch(isId ? `${API_URL}/grades/id/${identifier}` : `${API_URL}/grades/${encodeURIComponent(identifier)}`, { headers })
      ])

      const attendanceData = await attendanceRes.json()
      const gradesData = await gradesRes.json()

      const safeGrades = Array.isArray(gradesData) ? gradesData : []
      const safeAttendance = Array.isArray(attendanceData) ? attendanceData : []

      // Institutional Header
      doc.setFontSize(22)
      doc.setTextColor(0, 51, 102)
      doc.text('Academic Performance Report', 20, 20)

      doc.setFontSize(10)
      doc.setTextColor(100)
      doc.text(`Report Type: ${reportTitle}`, 20, 28)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 33)
      doc.line(20, 35, 190, 35)

      // Student Info
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text('Student Information', 20, 45)
      doc.setFontSize(10)
      doc.text(`Name: ${studentName}`, 25, 52)
      doc.text(`Student ID: ${selectedStudent?.studentId || 'N/A'}`, 25, 57)
      doc.text(`Assigned Class: ${selectedStudent?.grade || 'N/A'}`, 25, 62)
      doc.text(`Section: ${selectedStudent?.section || 'N/A'}`, 25, 67)

      // Performance Summary
      doc.setFontSize(14)
      doc.text('Assessment Summary', 20, 80)

      const tableRows = safeGrades.map((g: any) => [
        new Date(g.date).toLocaleDateString(),
        g.subject,
        g.title,
        g.score,
        g.grade
      ])

      autoTable(doc, {
        startY: 85,
        head: [['Date', 'Subject', 'Assessment', 'Score', 'Grade']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [0, 51, 102], textColor: 255 },
        styles: { fontSize: 9 }
      })

      // Attendance
      const finalY = (doc as any).lastAutoTable?.cursor?.y || 150
      doc.setFontSize(14)
      doc.text('Attendance Statistics', 20, finalY + 15)

      const total = safeAttendance.length
      const present = safeAttendance.filter((a: any) => a.status === 'Present').length
      const rate = total > 0 ? ((present / total) * 100).toFixed(1) : '0'

      doc.setFontSize(10)
      doc.text(`Overall Attendance Rate: ${rate}%`, 25, finalY + 22)
      doc.text(`Total Sessions: ${total}`, 25, finalY + 27)
      doc.text(`Present: ${present}`, 25, finalY + 32)

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text('This is an electronically generated report from the Institutional Portal.', 20, 285)

      doc.save(`Report_${studentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`)

      toast({
        title: "Report Downloaded",
        description: `Your academic report for ${studentName} is ready.`,
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        title: "Download Failed",
        description: "An error occurred while generating your report.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shadow-inner"
            >
              <GraduationCap className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                {t.dashboard}
                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0 bg-primary/5 text-primary border-primary/10">{t.portal}</Badge>
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t.activeStudent}
                </p>
                {students.length > 1 ? (
                  <Select
                    value={selectedStudent?.studentId || selectedStudent?.studentName}
                    onValueChange={(val) => {
                      const student = students.find(s => (s.studentId || s.studentName) === val)
                      if (student) handleStudentSelect(student)
                    }}
                  >
                    <SelectTrigger className="h-7 py-0 px-2 bg-secondary/50 border-none text-[11px] font-bold min-w-[150px]">
                      <SelectValue placeholder={t.selectStudent} />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(s => (
                        <SelectItem key={s.studentId || s._id} value={s.studentId || s.studentName} className="text-xs font-bold">
                          {s.studentName} ({s.studentId || 'N/A'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-[11px] font-bold text-foreground">
                    {studentName} {selectedStudent?.studentId ? `(${selectedStudent.studentId})` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={(val: 'en' | 'ta') => setLanguage(val)}>
              <SelectTrigger className="w-[100px] h-8 text-[11px] font-bold border-primary/20 bg-primary/5">
                <Languages className="w-3.5 h-3.5 mr-2 text-primary" />
                <SelectValue placeholder="EN / TA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en" className="text-xs font-bold">English</SelectItem>
                <SelectItem value="ta" className="text-xs font-bold">தமிழ்</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all relative"
              onClick={() => alert(t.notificationsEnabled)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 text-red-500 border-red-500/20 hover:bg-red-500/5 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Enhanced Welcome Banner */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-primary/20 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-primary/5"
          >
            <div className="relative z-10 max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">{t.welcomeBack}</Badge>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-[1.1] tracking-tight">
                {t.empowering} <span className="text-primary italic">{t.academicJourney}</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium opacity-80 mb-8 leading-relaxed">
                {t.stayUpdated}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-2xl px-6 py-6 h-auto font-black text-[10px] uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95">
                  {t.viewReports}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="rounded-2xl px-6 py-6 h-auto font-black text-[10px] uppercase tracking-widest gap-2 border-border/50 hover:bg-secondary/50 transition-all">
                  {t.contactSupport}
                </Button>
              </div>
            </div>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            <Sparkles className="absolute top-8 right-8 w-12 h-12 text-primary/20 animate-pulse pointer-events-none" />
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs Navigation */}
              <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-2xl w-fit border border-border/50">
                {[
                  { id: 'overview', label: t.overview },
                  { id: 'performance', label: t.performance },
                  { id: 'reports', label: t.reports },
                  { id: 'admissions', label: t.admissions }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                      ? 'bg-background text-primary shadow-sm border border-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <StudentDetailedPerformance studentName={studentName} studentId={selectedStudent?.studentId} language={language} />
                    <SchoolAnnouncements language={language} />
                  </motion.div>
                )}

                {activeTab === 'performance' && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          {t.academicGrowth}
                        </CardTitle>
                        <CardDescription>{t.performanceDesc}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                              <defs>
                                {['hsl(var(--primary))', 'hsl(215 94% 68%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'].map((color, idx) => (
                                  <linearGradient id={`colorScore-${idx}`} key={idx} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                  </linearGradient>
                                ))}
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700 }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 700 }}
                                domain={[0, 100]}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  borderRadius: '12px',
                                  border: '1px solid hsl(var(--border))',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}
                              />
                              <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                              {performanceData.length > 0 && Object.keys(performanceData[0])
                                .filter(key => key !== 'date')
                                .map((subject, idx) => {
                                  const colors = ['hsl(var(--primary))', 'hsl(215 94% 68%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)']
                                  const color = colors[idx % colors.length]
                                  return (
                                    <Area
                                      key={subject}
                                      type="monotone"
                                      dataKey={subject}
                                      name={subject}
                                      stroke={color}
                                      fillOpacity={1}
                                      fill={`url(#colorScore-${idx % colors.length})`}
                                      strokeWidth={3}
                                    />
                                  )
                                })}
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-card border-border/50 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-sm font-bold uppercase tracking-widest">{t.subjectComp}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={performanceData.slice(-1)}>
                                <XAxis dataKey="date" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip />
                                {performanceData.length > 0 && Object.keys(performanceData[0])
                                  .filter(key => key !== 'date')
                                  .map((subject, idx) => (
                                    <Bar key={subject} dataKey={subject} fill={`hsl(var(--primary) / ${0.3 + (idx * 0.2)})`} radius={[4, 4, 0, 0]} />
                                  ))}
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card border-border/50 shadow-sm flex flex-col justify-center p-8 text-center border-dashed">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-widest">{t.aiInsights}</h4>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {studentName} is showing exceptional growth in <span className="text-primary font-bold">Mathematics</span>. Suggesting advanced reading for the upcoming geometry module.
                        </p>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid gap-4"
                  >
                    {[
                      { title: 'Mid-term Assessment Report', date: 'March 2026', size: '2.4 MB' },
                      { title: 'January Attendance Summary', date: 'Feb 2026', size: '1.1 MB' },
                      { title: 'Extracurricular Participation', date: 'Jan 2026', size: '0.8 MB' }
                    ].map((report, idx) => (
                      <Card key={idx} className="bg-card border-border/50 hover:bg-secondary/20 transition-all cursor-pointer group">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                              <Calendar className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{report.title}</h4>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase">{report.date} • {report.size}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            className="rounded-xl group-hover:bg-primary/10 group-hover:text-primary"
                            onClick={() => handleDownloadReport(report.title)}
                          >
                            Download PDF
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'admissions' && (
                  <motion.div
                    key="admissions"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mx-10 pointer-events-none" />
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          {t.smartAdmissions}
                        </CardTitle>
                        <CardDescription>{t.admissionsDesc}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!selectedStudent ? (
                          <div className="text-center py-10 opacity-50">
                            <p className="font-bold uppercase tracking-widest text-sm">No Active Student Selected</p>
                          </div>
                        ) : (
                          <div className="relative border-l-2 border-border/50 ml-4 md:ml-10 space-y-12 pb-4">
                            {/* Application Submitted Step */}
                            <div className="relative pl-8 md:pl-12 group">
                              <div className={`absolute -left-[17px] top-1 p-1.5 rounded-full border-4 border-background transition-colors ${selectedStudent.status !== 'Rejected' ? 'bg-primary text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'bg-muted text-muted-foreground'}`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <h4 className={`text-lg font-black tracking-tight ${selectedStudent.status !== 'Rejected' ? 'text-foreground' : 'text-muted-foreground'}`}>{t.appSubmitted}</h4>
                              <p className="text-xs text-muted-foreground font-medium mt-1">{t.appSubmittedDesc}</p>
                              <Badge className="mt-3 bg-secondary/50 text-foreground border-border/50 text-[10px] font-bold py-0.5">{t.autoCapture}</Badge>
                            </div>

                            {/* Application Reviewed Step */}
                            <div className="relative pl-8 md:pl-12 group">
                              <div className={`absolute -left-[17px] top-1 p-1.5 rounded-full border-4 border-background transition-colors ${['Reviewed', 'Interview Scheduled', 'Approved', 'Waitlisted'].includes(selectedStudent.status) ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-secondary text-muted-foreground'}`}>
                                <UserCheck className="w-4 h-4" />
                              </div>
                              <h4 className={`text-lg font-black tracking-tight ${['Reviewed', 'Interview Scheduled', 'Approved', 'Waitlisted'].includes(selectedStudent.status) ? 'text-foreground' : 'text-muted-foreground opacity-60'}`}>{t.appReviewed}</h4>
                              <p className="text-xs text-muted-foreground font-medium mt-1">{t.appReviewedDesc}</p>
                            </div>

                            {/* Outcome Step */}
                            <div className="relative pl-8 md:pl-12 group">
                              <div className={`absolute -left-[17px] top-1 p-1.5 rounded-full border-4 border-background transition-colors ${selectedStudent.status === 'Approved' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' :
                                selectedStudent.status === 'Waitlisted' ? 'bg-amber-500 text-white' :
                                  selectedStudent.status === 'Rejected' ? 'bg-red-500 text-white' :
                                    'bg-secondary text-muted-foreground'
                                }`}>
                                {selectedStudent.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              </div>
                              <h4 className={`text-lg font-black tracking-tight ${selectedStudent.status === 'Approved' ? 'text-emerald-500' :
                                selectedStudent.status === 'Waitlisted' ? 'text-amber-500' :
                                  selectedStudent.status === 'Rejected' ? 'text-red-500' :
                                    'text-muted-foreground opacity-60'
                                }`}>
                                {selectedStudent.status === 'Approved' ? t.admissionApproved :
                                  selectedStudent.status === 'Waitlisted' ? t.waitlistedStatus :
                                    selectedStudent.status === 'Rejected' ? t.appRejected :
                                      t.awaitingDecision}
                              </h4>
                              <p className="text-xs text-muted-foreground font-medium mt-1">
                                {selectedStudent.status === 'Approved' ? t.approvedMsg :
                                  selectedStudent.status === 'Waitlisted' ? t.waitlistedMsg :
                                    selectedStudent.status === 'Rejected' ? t.rejectedMsg :
                                      t.awaitingMsg}
                              </p>
                              {selectedStudent.status === 'Approved' && (
                                <Button
                                  onClick={() => {
                                    setPaymentStep('input')
                                    setIsPaymentModalOpen(true)
                                  }}
                                  className="mt-4 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2"
                                >
                                  <CreditCard className="w-3.5 h-3.5" />
                                  {t.payFees}
                                </Button>
                              )}

                              {selectedStudent.status === 'Paid' && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-6 overflow-hidden relative group/banner"
                                >
                                  <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-sm -z-10 rounded-2xl" />
                                  <div className="p-5 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-500 animate-pulse rounded-full opacity-20 scale-150" />
                                        <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20 relative">
                                          <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">{t.feePaid}</p>
                                        <div className="flex items-center gap-2">
                                          <h5 className="font-black text-foreground">{t.paymentSuccess}</h5>
                                          <Badge variant="outline" className="text-[8px] font-black border-emerald-500/30 text-emerald-600 bg-emerald-500/10 uppercase tracking-widest px-1.5 py-0">
                                            {t.securePayment}
                                          </Badge>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground/80 mt-1">{t.successDesc}</p>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                      <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                        <span>TXN: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                        <span className="w-1 h-1 bg-border rounded-full" />
                                        <span>{new Date().toLocaleDateString()}</span>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all font-black text-[9px] uppercase tracking-widest gap-2 bg-emerald-500/5 h-9"
                                      >
                                        <FileDown className="w-3.5 h-3.5" />
                                        Download Receipt
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-8 h-fit self-start">
              <UpcomingEvents language={language} />

              {/* Enhanced Submit Query form */}
              <Card className="bg-card border-border/50 shadow-sm overflow-hidden group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    {t.submitQuery}
                  </CardTitle>
                  <CardDescription className="text-[11px] font-medium">{t.resolutionTarget} <span className="text-primary font-bold">{t.twentyFourHours}</span></CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitQuery} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-0.5">{t.subject}</label>
                      <Input
                        placeholder={t.subjectPlaceholder}
                        className="rounded-xl bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30 h-10 text-sm font-medium"
                        value={newQuery.subject}
                        onChange={(e) => setNewQuery(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-0.5">{t.priorityLevel}</label>
                      <Select value={newQuery.priority} onValueChange={(value) => setNewQuery(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger className="rounded-xl bg-secondary/30 border-none focus:ring-1 focus:ring-primary/30 h-10 text-sm font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          <SelectItem value="Low" className="text-xs font-bold">{t.lowPriority}</SelectItem>
                          <SelectItem value="Medium" className="text-xs font-bold">{t.mediumPriority}</SelectItem>
                          <SelectItem value="High" className="text-xs font-bold text-red-500">{t.highPriority}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-0.5">{t.detailedMessage}</label>
                      <Textarea
                        placeholder={t.messagePlaceholder}
                        className="rounded-xl bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30 min-h-[120px] text-sm font-medium resize-none"
                        value={newQuery.message}
                        onChange={(e) => setNewQuery(prev => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full rounded-xl py-6 h-auto font-black text-[10px] uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 group-hover:shadow-lg transition-transform">
                      {t.sendQuery}
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* My Queries Feed */}
          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-bold">{t.commHistory}</CardTitle>
                <CardDescription className="text-xs">{t.trackTickets}</CardDescription>
              </div>
              <div className="p-2 bg-primary/10 rounded-xl">
                <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">{queries.length} {t.tickets}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-20 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.parsingComm}</p>
                </div>
              ) : queries.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {queries.map((query: any, idx: number) => (
                    <motion.div
                      key={query._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative bg-secondary/20 hover:bg-secondary/40 border border-transparent hover:border-border/50 rounded-2xl p-5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`${getStatusColor(query.status)} text-[9px] font-black uppercase tracking-tighter border-none px-2 py-0.5`}>
                          {query.status}
                        </Badge>
                        <Badge variant="outline" className={`${getPriorityColor(query.priority)} text-[8px] font-bold border-none`}>
                          {query.priority} Priority
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">{query.subject}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 font-medium mb-4 italic opacity-80">"{query.message}"</p>
                      <div className="flex items-center justify-between border-t border-border/30 pt-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[9px] font-black text-muted-foreground uppercase">{new Date(query.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTicket(query)}
                          className="h-7 px-2 text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 transition-all flex items-center gap-1"
                        >
                          {t.viewDetails}
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>

                      {query.response && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" /> {t.adminResponse}
                          </p>
                          <p className="text-[11px] text-foreground font-medium line-clamp-2 leading-relaxed">{query.response}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-secondary/10 rounded-[2rem] border border-dashed border-border/50">
                  <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.noComm}</p>
                  <p className="text-[11px] text-muted-foreground/50 font-medium mt-1">{t.submitFirst}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Ticket Details Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem] border-primary/20 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className={`${selectedTicket ? getStatusColor(selectedTicket.status) : ''} text-[10px] font-black uppercase tracking-widest border-none px-3 py-1`}>
                {selectedTicket?.status}
              </Badge>
              <Badge variant="outline" className={`${selectedTicket ? getPriorityColor(selectedTicket.priority) : ''} text-[10px] font-bold border-none`}>
                {selectedTicket?.priority} Priority
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">{selectedTicket?.subject}</DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5" />
              {t.createdOn} {selectedTicket?.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.originalMessage}</label>
              <div className="p-4 bg-secondary/30 rounded-2xl text-sm font-medium leading-relaxed italic opacity-90 border border-border/30">
                "{selectedTicket?.message}"
              </div>
            </div>

            {selectedTicket?.response && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t.officialAdminResponse}
                </label>
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/20 text-sm font-medium text-foreground leading-relaxed shadow-sm">
                  {selectedTicket.response}
                </div>
              </div>
            )}

            {!selectedTicket?.response && selectedTicket?.status !== 'Resolved' && (
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">{t.reviewingMsg}</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <Button
              onClick={() => setSelectedTicket(null)}
              className="w-full rounded-2xl py-6 h-auto font-black text-[10px] uppercase tracking-widest gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl"
            >
              {t.closeDetails}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={(open) => !open && !isProcessingPayment && setIsPaymentModalOpen(false)}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-primary/20 shadow-2xl overflow-hidden p-0">
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8">
            <DialogHeader className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary flex items-center gap-1.5 px-3 py-1">
                  <Sparkles className="w-3 h-3" />
                  {t.securePayment}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">{t.paymentGateway}</DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {selectedStudent?.studentName} • {selectedStudent?.studentId}
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {paymentStep === 'input' && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-secondary/30 p-5 rounded-2xl border border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t.amount}</p>
                    <p className="text-3xl font-black text-foreground tracking-tighter">{t.feeAmount}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-0.5">{t.cardDetails}</label>
                      <div className="space-y-3">
                        <Input placeholder={t.cardName} className="rounded-xl bg-background border-border/50 h-12 text-sm font-medium" />
                        <Input placeholder={t.cardNumber} className="rounded-xl bg-background border-border/50 h-12 text-sm font-medium" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder={t.expiry} className="rounded-xl bg-background border-border/50 h-12 text-sm font-medium" />
                          <Input placeholder={t.cvv} type="password" className="rounded-xl bg-background border-border/50 h-12 text-sm font-medium" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePaymentSubmit}
                    className="w-full rounded-2xl py-7 h-auto font-black text-[11px] uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                  >
                    {t.payNow}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {paymentStep === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center text-center gap-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary/50" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight mb-2">{t.processing}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t.paymentProcessingDesc}</p>
                  </div>
                </motion.div>
              )}

              {paymentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center gap-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-emerald-600 mb-2">{t.paymentSuccess}</h3>
                    <p className="text-sm font-bold text-muted-foreground max-w-[200px] leading-relaxed mx-auto">
                      {t.successDesc}
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="mt-4 rounded-2xl py-6 px-10 h-auto font-black text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all"
                  >
                    {t.closeDetails}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}