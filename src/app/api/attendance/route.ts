import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const date = searchParams.get("date");
    const studentId = searchParams.get("studentId");

    const where: {
      courseId?: string;
      date?: string;
      studentId?: string;
    } = {};

    if (courseId) where.courseId = courseId;
    if (date) where.date = date;
    if (studentId) where.studentId = studentId;

    const attendance = await db.attendance.findMany({
      where,
      include: {
        student: true,
        course: true,
        schedule: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(attendance);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data absensi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, courseId, scheduleId, date, status, notes } = body;

    if (!studentId || !courseId || !scheduleId || !date || !status) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Use upsert to handle both create and update
    const attendance = await db.attendance.upsert({
      where: {
        studentId_courseId_scheduleId_date: {
          studentId,
          courseId,
          scheduleId,
          date,
        },
      },
      update: {
        status,
        notes: notes || null,
      },
      create: {
        studentId,
        courseId,
        scheduleId,
        date,
        status,
        notes: notes || null,
      },
      include: {
        student: true,
        course: true,
        schedule: {
          include: {
            course: true,
          },
        },
      },
    });

    return NextResponse.json(attendance);
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan absensi" }, { status: 500 });
  }
}
