import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, Loader2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, subMonths } from 'date-fns';
import { API_URL } from '@/lib/api-config';

export function ExportMenu({ data }: { data: any }) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const token = localStorage.getItem('token');
            const [outlookRes, healthRes] = await Promise.all([
                fetch(`${API_URL}/analytics/annual-outlook`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.ok ? res.json() : null),
                fetch(`${API_URL}/analytics/health-index`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.ok ? res.json() : null)
            ]);

            const doc = new jsPDF();
            const dateStr = format(new Date(), 'MMM dd, yyyy HH:mm');

            // Cover Page
            doc.setFillColor(15, 23, 42); // slate-900
            doc.rect(0, 0, 210, 297, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(32);
            doc.setFont("helvetica", "bold");
            doc.text('EXECUTIVE STRATEGIC SUMMARY', 105, 100, { align: 'center' });

            doc.setFontSize(14);
            doc.setFont("helvetica", "normal");
            doc.text(`ANNUAL PERFORMANCE AUDIT: ${format(subMonths(new Date(), 11), 'MMM yyyy')} - ${format(new Date(), 'MMM yyyy')}`, 105, 115, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text(`GENERATED ON: ${dateStr}`, 105, 260, { align: 'center' });
            doc.text('CONFIDENTIAL | CEO ACCESS ONLY', 105, 265, { align: 'center' });

            doc.addPage();
            doc.setTextColor(15, 23, 42);

            // Fetch Current Top-Level Stats
            const { stats } = data;
            const healthData = healthRes || data.healthData;

            // Page 2: Executive Synthesis & Priority Actions
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text('1. Executive Synthesis', 14, 25);

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const healthStatus = healthData?.currentHealth?.riskLevel === 'LOW' ? 'strong'
                : healthData?.currentHealth?.riskLevel === 'MEDIUM' ? 'stable' : 'critical';

            const synthesisText = `The institution is currently maintaining a ${healthStatus} operational posture with an overall Strategic Vitality score of ${healthData?.currentHealth?.overall || 'N/A'}/100. Total student population stands at ${stats.studentsCount}, supported by a faculty and staff capacity of ${stats.staffCount}. System intelligence indicates ${stats.queriesCount > 5 ? 'elevated friction in stakeholder sentiment requiring immediate attention' : 'sustained and healthy stakeholder sentiment'} across ${stats.admissionsCount} total cumulative records.`;

            // split text to fit width
            const splitSynthesis = doc.splitTextToSize(synthesisText, 180);
            doc.text(splitSynthesis, 14, 35);

            let nextSectionY = 35 + (splitSynthesis.length * 6) + 10;

            // Priority Action Board
            let hasAlert = false;
            let alertMsg = '';
            if (stats.queriesCount > 5) {
                hasAlert = true;
                alertMsg = `CRITICAL ALERT: ${stats.queriesCount} Priority Stakeholder Queries require immediate executive resolution.`;
            } else if (healthData?.currentHealth?.overall < 70) {
                hasAlert = true;
                alertMsg = `CRITICAL ALERT: Institutional Health Index has dropped below threshold (${healthData.currentHealth.overall}/100).`;
            }

            if (hasAlert) {
                doc.setFillColor(239, 68, 68); // red-500
                doc.rect(14, nextSectionY, 182, 16, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(11);
                doc.setFont("helvetica", "bold");
                doc.text(alertMsg, 105, nextSectionY + 10, { align: 'center' });
                doc.setTextColor(15, 23, 42); // reset to slate-900
                nextSectionY += 25;
            } else {
                nextSectionY += 5;
            }

            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text('2. Institutional Operational Velocity', 14, nextSectionY);

            const overviewData = [
                ['Total Student Population', stats.studentsCount.toString(), 'Stable Growth'],
                ['Faculty & Support Staff', stats.staffCount.toString(), 'Optimal Capacity'],
                ['Admission Pipeline (Cumulative)', stats.admissionsCount.toString(), 'High Velocity'],
                ['Open Stakeholder Queries', stats.queriesCount.toString(), stats.queriesCount > 5 ? 'Priority Action' : 'Monitored'],
            ];

            autoTable(doc, {
                startY: nextSectionY + 10,
                head: [['Core Metric', 'Current Value', 'Status Index']],
                body: overviewData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }, // slate-900
                alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
            });

            // Institutional Health Index Section
            let nextY = (doc as any).lastAutoTable.finalY + 20;
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text('3. Institutional Health Index (IHI)', 14, nextY);

            if (healthData && healthData.currentHealth) {
                const IHIbody = [
                    ['Overall Strategic Vitality', `${healthData.currentHealth.overall} / 100`, `${healthData.currentHealth.riskLevel} RISK`],
                    ['Academic Excellence Vector', `${healthData.currentHealth.academic}`, `${healthData.deltas.academic > 0 ? '+' : ''}${healthData.deltas.academic}% MoM`],
                    ['Financial / Operational Health', `${healthData.currentHealth.financial}`, `${healthData.deltas.financial > 0 ? '+' : ''}${healthData.deltas.financial}% MoM`],
                    ['Student Wellbeing Index', `${healthData.currentHealth.wellbeing}`, `${healthData.deltas.wellbeing > 0 ? '+' : ''}${healthData.deltas.wellbeing}% MoM`],
                    ['Staff Efficiency Pulse', `${healthData.currentHealth.efficiency}`, `${healthData.deltas.efficiency > 0 ? '+' : ''}${healthData.deltas.efficiency}% MoM`],
                ];

                autoTable(doc, {
                    startY: nextY + 10,
                    head: [['Vector', 'Score / 100', 'Performance Delta']],
                    body: IHIbody,
                    theme: 'grid',
                    headStyles: { fillColor: [15, 23, 42] }, // slate-900
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    styles: { cellPadding: 4, fontSize: 10 }
                });
            }

            // Page 3: Annual Trends
            if (outlookRes) {
                doc.addPage();
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                doc.text('4. Annual Strategic Trends (12-Month)', 14, 25);

                // Academic Trend
                doc.setFontSize(12);
                doc.text('4.1 Academic Proficiency Trend', 14, 35);
                const academicBody = outlookRes.academicTrend.map((t: any) => [t.range, `${t.value}%`]);
                autoTable(doc, {
                    startY: 40,
                    head: [['Month', 'Avg Proficiency']],
                    body: academicBody,
                    theme: 'striped',
                    headStyles: { fillColor: [15, 23, 42] },
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    margin: { right: 110 }
                });

                // Attendance Trend
                let attY = (doc as any).lastAutoTable.finalY + 15;
                doc.text('4.2 Operational Vitality (Attendance)', 14, attY);
                const attendanceBody = outlookRes.attendanceTrend.map((t: any) => [t.range, `${t.value}%`]);
                autoTable(doc, {
                    startY: attY + 5,
                    head: [['Month', 'Attendance Rate']],
                    body: attendanceBody,
                    theme: 'striped',
                    headStyles: { fillColor: [15, 23, 42] },
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    margin: { right: 110 }
                });

                // Enrollment Velocity
                doc.text('4.3 Enrollment Velocity', 115, 35);
                const enrollmentBody = outlookRes.enrollmentVelocity.map((t: any) => [t.range, t.value.toString()]);
                autoTable(doc, {
                    startY: 40,
                    head: [['Month', 'New Enrollments']],
                    body: enrollmentBody,
                    theme: 'striped',
                    headStyles: { fillColor: [15, 23, 42] },
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    margin: { left: 115 }
                });
            }

            // Sentiment Analysis Section
            let sentimentY = (doc as any).lastAutoTable.finalY + 20;
            if (sentimentY > 240) {
                doc.addPage();
                sentimentY = 25;
            }
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text('5. Stakeholder Sentiment Pulse', 14, sentimentY);

            const queries = data?.queries || [];
            const total = queries.length || 1;
            const positive = queries.filter((q: any) => q.sentiment === 'Positive').length;
            const concerned = queries.filter((q: any) => q.sentiment === 'Concerned').length;
            const neutral = queries.filter((q: any) => q.sentiment === 'Neutral').length;

            const sentimentData = [
                ['Positive Stakeholder Sentiment', `${Math.round((positive / total) * 100)}%`, 'Healthy / Sustained'],
                ['Neutral Sentiment / Logic Mention', `${Math.round((neutral / total) * 100)}%`, 'Stable'],
                ['Critical / Concerned Queries', `${Math.round((concerned / total) * 100)}%`, concerned > 2 ? 'Action Required' : 'Friction Monitored'],
            ];

            autoTable(doc, {
                startY: sentimentY + 10,
                head: [['Clarity Category', 'Impact Weight', 'System Response']],
                body: sentimentData,
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] }, // slate-900
                alternateRowStyles: { fillColor: [248, 250, 252] },
            });

            // Footer
            const pageCount = (doc as any).internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184); // slate-400
                doc.text(
                    `Page ${i} of ${pageCount} - Quantum Intelligence Suite | Annual Executive Audit`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            doc.save(`Executive_Report_Annual_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF report:', error);
            alert('An error occurred while generating the Executive Report.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            variant="outline"
            size="sm"
            className="h-11 px-6 rounded-2xl gap-2 border-primary/20 bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
        >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isExporting ? 'Compiling Vector...' : 'Generate Executive Report'}
        </Button>
    );
}
