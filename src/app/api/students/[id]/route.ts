import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nim, name, email, phone, class: studentClass } = body;

    if (!nim || !name) {
      return NextResponse.json({ error: "NIM dan Nama wajib diisi" }, { status: 400 });
    }

    // Check if NIM already exists for another student
    const existingStudent = await db.student.findFirst({
      where: {
        nim,
        NOT: { id },
      },
    });

    if (existingStudent) {
      return NextResponse.json({ error: "NIM sudah digunakan mahasiswa lain" }, { status: 400 });
    }

    const student = await db.student.update({
      where: { id },
      data: {
        nim,
        name,
        email: email || null,
        phone: phone || null,
        class: studentClass || null,
      },
    });

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui mahasiswa" }, { status: 500 });
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
      where: { studentId: id },
    });

    await db.student.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Mahasiswa berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus mahasiswa" }, { status: 500 });
  }
}
