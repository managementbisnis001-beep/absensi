import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const students = await db.student.findMany({
      orderBy: { nim: "asc" },
    });
    return NextResponse.json(students);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data mahasiswa" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nim, name, email, phone, class: studentClass } = body;

    if (!nim || !name) {
      return NextResponse.json({ error: "NIM dan Nama wajib diisi" }, { status: 400 });
    }

    // Check if NIM already exists
    const existingStudent = await db.student.findUnique({
      where: { nim },
    });

    if (existingStudent) {
      return NextResponse.json({ error: "NIM sudah terdaftar" }, { status: 400 });
    }

    const student = await db.student.create({
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
    return NextResponse.json({ error: "Gagal menambahkan mahasiswa" }, { status: 500 });
  }
}
