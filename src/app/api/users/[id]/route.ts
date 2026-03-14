import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
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
    const { username, password, name, email, role } = body;

    if (!username || !name) {
      return NextResponse.json({ error: "Username dan nama wajib diisi" }, { status: 400 });
    }

    // Check if username already exists for another user
    const existingUser = await db.user.findFirst({
      where: {
        username,
        NOT: { id },
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username sudah digunakan user lain" }, { status: 400 });
    }

    // Prepare update data
    const updateData: {
      username: string;
      name: string;
      email: string | null;
      role: string;
      password?: string;
    } = {
      username,
      name,
      email: email || null,
      role: role || "dosen",
    };

    // Only update password if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui user" }, { status: 500 });
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

    // Prevent deleting the last admin
    const admins = await db.user.findMany({
      where: { role: "admin" },
    });

    if (admins.length === 1 && admins[0].id === id) {
      return NextResponse.json({ error: "Tidak dapat menghapus admin terakhir" }, { status: 400 });
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}
