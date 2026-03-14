import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const schedules = await db.schedule.findMany({
      include: {
        course: true,
      },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });
    return NextResponse.json(schedules);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data jadwal" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, day, startTime, endTime, room } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Mata kuliah wajib dipilih" }, { status: 400 });
    }

    const schedule = await db.schedule.create({
      data: {
        courseId,
        day: day || "Senin",
        startTime: startTime || "08:00",
        endTime: endTime || "10:00",
        room: room || null,
      },
      include: {
        course: true,
      },
    });

    return NextResponse.json(schedule);
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan jadwal" }, { status: 500 });
  }
}
