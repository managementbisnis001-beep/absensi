import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, name, credits, lecturer, semester } = body;

    if (!code || !name) {
      return NextResponse.json({ error: "Kode dan Nama mata kuliah wajib diisi" }, { status: 400 });
    }

    // Check if code already exists for another course
    const existingCourse = await db.course.findFirst({
      where: {
        code,
        NOT: { id },
      },
    });

    if (existingCourse) {
      return NextResponse.json({ error: "Kode mata kuliah sudah digunakan" }, { status: 400 });
    }

    const course = await db.course.update({
      where: { id },
      data: {
        code,
        name,
        credits: credits || 3,
        lecturer: lecturer || null,
        semester: semester || 1,
      },
    });

    return NextResponse.json(course);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui mata kuliah" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete related attendance records first
    await db.attendance.deleteMany({
      where: { courseId: id },
    });

    // Delete related schedules
    await db.schedule.deleteMany({
      where: { courseId: id },
    });

    await db.course.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Mata kuliah berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus mata kuliah" }, { status: 500 });
  }
}
