import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireAuth } from "@/lib/api-auth";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const courses = await db.course.findMany({
      orderBy: [{ semester: "asc" }, { code: "asc" }],
    });
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data mata kuliah" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { code, name, credits, lecturer, semester } = body;

    if (!code || !name) {
      return NextResponse.json({ error: "Kode dan Nama mata kuliah wajib diisi" }, { status: 400 });
    }

    // Check if code already exists
    const existingCourse = await db.course.findUnique({
      where: { code },
    });

    if (existingCourse) {
      return NextResponse.json({ error: "Kode mata kuliah sudah terdaftar" }, { status: 400 });
    }

    const course = await db.course.create({
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
    return NextResponse.json({ error: "Gagal menambahkan mata kuliah" }, { status: 500 });
  }
}
