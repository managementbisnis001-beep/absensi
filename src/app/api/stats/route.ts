import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [totalStudents, totalCourses, totalSchedules, attendances] = await Promise.all([
      db.student.count(),
      db.course.count(),
      db.schedule.count(),
      db.attendance.findMany(),
    ]);

    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = attendances.filter(a => a.date === today).length;

    const presentCount = attendances.filter(a => a.status === "hadir").length;
    const sickCount = attendances.filter(a => a.status === "sakit").length;
    const permissionCount = attendances.filter(a => a.status === "izin").length;
    const absentCount = attendances.filter(a => a.status === "alpha").length;

    const totalAttendance = attendances.length;
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    return NextResponse.json({
      totalStudents,
      totalCourses,
      totalSchedules,
      todayAttendance,
      attendanceRate,
      presentCount,
      sickCount,
      permissionCount,
      absentCount,
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
