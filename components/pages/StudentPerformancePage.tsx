'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Menu, Users, BookOpen } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import CEOSidebar from '@/components/dashboard/CEOSidebar'

interface ClassData {
  id: string
  name: string
  sections: string[]
  totalStudents: number
  averagePerformance: number
}

interface StudentPerformancePageProps {
  onNavigate: (page: 'dashboard' | 'staff' | 'admissions' | 'queries' | 'admin' | 'student-performance' | 'class-details') => void
  onClassSelect?: (className: string, section: string) => void
}

const mockClasses: ClassData[] = [
  { id: '6', name: 'Class 6', sections: ['A', 'B', 'C'], totalStudents: 90, averagePerformance: 78 },
  { id: '7', name: 'Class 7', sections: ['A', 'B', 'C'], totalStudents: 85, averagePerformance: 82 },
  { id: '8', name: 'Class 8', sections: ['A', 'B', 'C'], totalStudents: 88, averagePerformance: 75 },
  { id: '9', name: 'Class 9', sections: ['A', 'B', 'C', 'D'], totalStudents: 120, averagePerformance: 80 },
  { id: '10', name: 'Class 10', sections: ['A', 'B', 'C', 'D'], totalStudents: 115, averagePerformance: 85 },
  { id: '11', name: 'Class 11', sections: ['A', 'B'], totalStudents: 60, averagePerformance: 77 },
  { id: '12', name: 'Class 12', sections: ['A', 'B'], totalStudents: 58, averagePerformance: 83 },
]

export default function StudentPerformancePage({ onNavigate, onClassSelect }: StudentPerformancePageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>('admin')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserRole(userData.role || 'admin')
    }
  }, [])

  const handleClassClick = (className: string, section: string) => {
    if (onClassSelect) {
      onClassSelect(className, section)
    }
    onNavigate('class-details')
  }

  return (
    <div className="flex h-screen bg-background">
      {userRole === 'ceo' ? (
        <CEOSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={onNavigate} 
        />
      ) : (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={onNavigate} 
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Student Performance</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 bg-background overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-muted-foreground">Select a class and section to view detailed student performance data</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockClasses.map((classData) => (
                <Card key={classData.id} className="border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {classData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Students:</span>
                        <span className="font-medium">{classData.totalStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Performance:</span>
                        <span className="font-medium">{classData.averagePerformance}%</span>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-3">Sections:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {classData.sections.map((section) => (
                            <Button
                              key={section}
                              variant="outline"
                              size="sm"
                              onClick={() => handleClassClick(classData.name, section)}
                              className="justify-center"
                            >
                              Section {section}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}