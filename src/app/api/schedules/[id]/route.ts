import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { courseId, day, startTime, endTime, room } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Mata kuliah wajib dipilih" }, { status: 400 });
    }

    const schedule = await db.schedule.update({
      where: { id },
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
    return NextResponse.json({ error: "Gagal memperbarui jadwal" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;

    // Delete related attendance records first
    await db.attendance.deleteMany({
      where: { scheduleId: id },
    });

    await db.schedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Jadwal berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus jadwal" }, { status: 500 });
  }
}
