import { attendanceRecords, faculty, Faculty } from '@/data/mockData';

export interface PayrollReport {
    facultyId: string;
    facultyName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    payableDays: number;
    deductions: number;
    netSalaryStatus: 'Processing' | 'Approved' | 'Hold';
}

/**
 * Simulates integration with the State HRMS / Payroll System.
 * In production, this would communicate with an API gateway (e.g., NIC Payroll API).
 */
export const PayrollService = {
    /**
     * Generates a monthly payroll report based on attendance logs.
     */
    generateMonthlyReport: (month: number, year: number): PayrollReport[] => {
        console.log(`Generating payroll report for ${month}/${year}...`);

        return faculty.map(f => {
            // Find records for this month
            const monthlyRecords = attendanceRecords.filter(r => {
                const d = new Date(r.date);
                return d.getMonth() === month && d.getFullYear() === year && r.facultyId === f.id;
            });

            const totalDays = 30; // Standardize for now
            const presentDays = monthlyRecords.filter(r => r.status === 'present').length;
            const lateDays = monthlyRecords.filter(r => r.status === 'late').length;
            const halfDays = monthlyRecords.filter(r => r.status === 'half-day').length;

            // Calculate basic deductions logic (e.g., 3 lates = 1 leave)
            const lateDeduction = Math.floor(lateDays / 3);
            const halfDayDeduction = halfDays * 0.5;

            const absentDays = totalDays - (presentDays + lateDays + halfDays); // Simplified

            const payableDays = presentDays + lateDays + halfDays - (lateDeduction + halfDayDeduction);

            return {
                facultyId: f.id,
                facultyName: f.name,
                totalDays,
                presentDays,
                absentDays,
                lateDays,
                payableDays,
                deductions: lateDeduction + halfDayDeduction,
                netSalaryStatus: payableDays > 20 ? 'Approved' : 'Hold' // Auto-hold if low attendance
            };
        });
    },

    /**
     * Syncs final data to the external HRMS system.
     */
    syncToHRMS: async (reports: PayrollReport[]): Promise<{ success: boolean; transactionId: string }> => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `HRMS-SYNC-${Date.now()}`
                });
            }, 1500);
        });
    }
};
