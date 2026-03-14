"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardCheck, 
  BarChart3, 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  GraduationCap,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  UserCheck,
  CalendarDays,
  Building,
  LogOut,
  Shield,
  UserCog,
  Loader2,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";

// Types
interface Student {
  id: string;
  nim: string;
  name: string;
  email: string | null;
  phone: string | null;
  class: string | null;
}

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string | null;
  semester: number;
}

interface Schedule {
  id: string;
  courseId: string;
  course: Course;
  day: string;
  startTime: string;
  endTime: string;
  room: string | null;
}

interface Attendance {
  id: string;
  studentId: string;
  student: Student;
  courseId: string;
  course: Course;
  scheduleId: string;
  schedule: Schedule;
  date: string;
  status: string;
  notes: string | null;
}

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalSchedules: number;
  todayAttendance: number;
  attendanceRate: number;
  presentCount: number;
  sickCount: number;
  permissionCount: number;
  absentCount: number;
}

interface User {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const STATUS_OPTIONS = [
  { value: "hadir", label: "Hadir", icon: CheckCircle, color: "bg-green-500" },
  { value: "sakit", label: "Sakit", icon: AlertCircle, color: "bg-yellow-500" },
  { value: "izin", label: "Izin", icon: HelpCircle, color: "bg-blue-500" },
  { value: "alpha", label: "Alpha", icon: XCircle, color: "bg-red-500" },
];

// Login Component
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const showDefaultCredentials = process.env.NODE_ENV !== "production";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Username atau password salah");
      } else {
        toast.success("Login berhasil!");
        // Redirect ke halaman utama/dashboard
        window.location.href = "/";
      }
    } catch {
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Sistem Absensi Perkuliahan</CardTitle>
          <CardDescription>Masuk ke sistem untuk mengelola absensi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Masuk...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Masuk
                </>
              )}
            </Button>
          </form>
          {showDefaultCredentials && (
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="font-medium mb-1">Default Login Admin:</p>
              <p>Username: <code className="bg-background px-1 rounded">admin</code></p>
              <p>Password: <code className="bg-background px-1 rounded">admin123</code></p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main App Component
function AttendanceApp() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalCourses: 0,
    totalSchedules: 0,
    todayAttendance: 0,
    attendanceRate: 0,
    presentCount: 0,
    sickCount: 0,
    permissionCount: 0,
    absentCount: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [studentForm, setStudentForm] = useState({ nim: "", name: "", email: "", phone: "", class: "" });
  const [courseForm, setCourseForm] = useState({ code: "", name: "", credits: 3, lecturer: "", semester: 1 });
  const [scheduleForm, setScheduleForm] = useState({ courseId: "", day: "Senin", startTime: "08:00", endTime: "10:00", room: "" });
  const [attendanceForm, setAttendanceForm] = useState({ courseId: "", scheduleId: "", date: "", class: "" });
  const [userForm, setUserForm] = useState({ username: "", password: "", name: "", email: "", role: "dosen" });
  
  // Edit states
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  // Role check
  const isAdmin = session?.user?.role === "admin";
  const isDosen = session?.user?.role === "dosen";

  // Fetch all data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [studentsRes, coursesRes, schedulesRes, statsRes, usersRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/courses"),
          fetch("/api/schedules"),
          fetch("/api/stats"),
          isAdmin ? fetch("/api/users") : null,
        ]);
        
        const [studentsData, coursesData, schedulesData, statsData, usersData] = await Promise.all([
          studentsRes.json(),
          coursesRes.json(),
          schedulesRes.json(),
          statsRes.json(),
          isAdmin && usersRes ? usersRes.json() : Promise.resolve([]),
        ]);
        
        if (studentsRes.ok) setStudents(studentsData);
        if (coursesRes.ok) setCourses(coursesData);
        if (schedulesRes.ok) setSchedules(schedulesData);
        if (statsRes.ok) setStats(statsData);
        if (isAdmin && usersRes?.ok) setUsers(usersData);
      } catch {
        toast.error("Gagal memuat data");
      }
      setLoading(false);
    };
    
    if (session) loadInitialData();
  }, [session, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes, schedulesRes, statsRes, usersRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/courses"),
        fetch("/api/schedules"),
        fetch("/api/stats"),
        isAdmin ? fetch("/api/users") : null,
      ]);
      
      const [studentsData, coursesData, schedulesData, statsData, usersData] = await Promise.all([
        studentsRes.json(),
        coursesRes.json(),
        schedulesRes.json(),
        statsRes.json(),
        isAdmin && usersRes ? usersRes.json() : Promise.resolve([]),
      ]);
      
      if (studentsRes.ok) setStudents(studentsData);
      if (coursesRes.ok) setCourses(coursesData);
      if (schedulesRes.ok) setSchedules(schedulesData);
      if (statsRes.ok) setStats(statsData);
      if (isAdmin && usersRes?.ok) setUsers(usersData);
    } catch {
      toast.error("Gagal memuat data");
    }
    setLoading(false);
  };

  // Student CRUD
  const handleAddStudent = async () => {
    if (!studentForm.nim || !studentForm.name) {
      toast.error("NIM dan Nama wajib diisi");
      return;
    }
    
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      });
      
      if (res.ok) {
        toast.success("Mahasiswa berhasil ditambahkan");
        setStudentDialogOpen(false);
        setStudentForm({ nim: "", name: "", email: "", phone: "", class: "" });
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || "Gagal menambahkan mahasiswa");
      }
    } catch {
      toast.error("Gagal menambahkan mahasiswa");
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      });
      
      if (res.ok) {
        toast.success("Mahasiswa berhasil diperbarui");
        setStudentDialogOpen(false);
        setEditingStudent(null);
        setStudentForm({ nim: "", name: "", email: "", phone: "", class: "" });
        fetchData();
      } else {
        toast.error("Gagal memperbarui mahasiswa");
      }
    } catch {
      toast.error("Gagal memperbarui mahasiswa");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Mahasiswa berhasil dihapus");
        fetchData();
      } else {
        toast.error("Gagal menghapus mahasiswa");
      }
    } catch {
      toast.error("Gagal menghapus mahasiswa");
    }
  };

  // Course CRUD
  const handleAddCourse = async () => {
    if (!courseForm.code || !courseForm.name) {
      toast.error("Kode dan Nama mata kuliah wajib diisi");
      return;
    }
    
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });
      
      if (res.ok) {
        toast.success("Mata kuliah berhasil ditambahkan");
        setCourseDialogOpen(false);
        setCourseForm({ code: "", name: "", credits: 3, lecturer: "", semester: 1 });
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || "Gagal menambahkan mata kuliah");
      }
    } catch {
      toast.error("Gagal menambahkan mata kuliah");
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    
    try {
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseForm),
      });
      
      if (res.ok) {
        toast.success("Mata kuliah berhasil diperbarui");
        setCourseDialogOpen(false);
        setEditingCourse(null);
        setCourseForm({ code: "", name: "", credits: 3, lecturer: "", semester: 1 });
        fetchData();
      } else {
        toast.error("Gagal memperbarui mata kuliah");
      }
    } catch {
      toast.error("Gagal memperbarui mata kuliah");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Mata kuliah berhasil dihapus");
        fetchData();
      } else {
        toast.error("Gagal menghapus mata kuliah");
      }
    } catch {
      toast.error("Gagal menghapus mata kuliah");
    }
  };

  // Schedule CRUD
  const handleAddSchedule = async () => {
    if (!scheduleForm.courseId) {
      toast.error("Pilih mata kuliah terlebih dahulu");
      return;
    }
    
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleForm),
      });
      
      if (res.ok) {
        toast.success("Jadwal berhasil ditambahkan");
        setScheduleDialogOpen(false);
        setScheduleForm({ courseId: "", day: "Senin", startTime: "08:00", endTime: "10:00", room: "" });
        fetchData();
      } else {
        toast.error("Gagal menambahkan jadwal");
      }
    } catch {
      toast.error("Gagal menambahkan jadwal");
    }
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return;
    
    try {
      const res = await fetch(`/api/schedules/${editingSchedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleForm),
      });
      
      if (res.ok) {
        toast.success("Jadwal berhasil diperbarui");
        setScheduleDialogOpen(false);
        setEditingSchedule(null);
        setScheduleForm({ courseId: "", day: "Senin", startTime: "08:00", endTime: "10:00", room: "" });
        fetchData();
      } else {
        toast.error("Gagal memperbarui jadwal");
      }
    } catch {
      toast.error("Gagal memperbarui jadwal");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Jadwal berhasil dihapus");
        fetchData();
      } else {
        toast.error("Gagal menghapus jadwal");
      }
    } catch {
      toast.error("Gagal menghapus jadwal");
    }
  };

  // User CRUD (Admin only)
  const handleAddUser = async () => {
    if (!userForm.username || !userForm.password || !userForm.name) {
      toast.error("Username, password, dan nama wajib diisi");
      return;
    }
    
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      
      if (res.ok) {
        toast.success("User berhasil ditambahkan");
        setUserDialogOpen(false);
        setUserForm({ username: "", password: "", name: "", email: "", role: "dosen" });
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || "Gagal menambahkan user");
      }
    } catch {
      toast.error("Gagal menambahkan user");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      
      if (res.ok) {
        toast.success("User berhasil diperbarui");
        setUserDialogOpen(false);
        setEditingUser(null);
        setUserForm({ username: "", password: "", name: "", email: "", role: "dosen" });
        fetchData();
      } else {
        toast.error("Gagal memperbarui user");
      }
    } catch {
      toast.error("Gagal memperbarui user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User berhasil dihapus");
        fetchData();
      } else {
        const error = await res.json();
        toast.error(error.error || "Gagal menghapus user");
      }
    } catch {
      toast.error("Gagal menghapus user");
    }
  };

  // Attendance
  const fetchAttendanceByDate = async () => {
    if (!attendanceForm.courseId || !attendanceForm.date) {
      toast.error("Pilih mata kuliah dan tanggal");
      return;
    }
    
    try {
      const res = await fetch(`/api/attendance?courseId=${attendanceForm.courseId}&date=${attendanceForm.date}`);
      if (res.ok) {
        setAttendances(await res.json());
      }
    } catch {
      toast.error("Gagal memuat data absensi");
    }
  };

  const handleTakeAttendance = async (studentId: string, status: string, notes?: string) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          courseId: attendanceForm.courseId,
          scheduleId: attendanceForm.scheduleId,
          date: attendanceForm.date,
          status,
          notes,
        }),
      });
      
      if (res.ok) {
        fetchAttendanceByDate();
      } else {
        toast.error("Gagal menyimpan absensi");
      }
    } catch {
      toast.error("Gagal menyimpan absensi");
    }
  };

  const handleBulkAttendance = async (status: string) => {
    const classStudents = attendanceForm.class 
      ? students.filter(s => s.class === attendanceForm.class)
      : students;
    
    try {
      const promises = classStudents.map(student => 
        fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student.id,
            courseId: attendanceForm.courseId,
            scheduleId: attendanceForm.scheduleId,
            date: attendanceForm.date,
            status,
          }),
        })
      );
      
      await Promise.all(promises);
      toast.success("Absensi massal berhasil disimpan");
      fetchAttendanceByDate();
    } catch {
      toast.error("Gagal menyimpan absensi massal");
    }
  };

  // Filter students by class for attendance
  const filteredStudents = attendanceForm.class 
    ? students.filter(s => s.class === attendanceForm.class)
    : students;

  // Search filter
  const searchedStudents = students.filter(s => 
    s.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.class?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const searchedCourses = courses.filter(c =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get schedules for selected course
  const courseSchedules = schedules.filter(s => s.courseId === attendanceForm.courseId);

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sistem Absensi Perkuliahan</h1>
              <p className="text-muted-foreground">Kelola absensi mahasiswa dengan mudah dan efisien</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Shield className="h-4 w-4" />
              <div className="text-sm">
                <p className="font-medium">{session.user.name}</p>
                <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                  {isAdmin ? "Admin" : "Dosen"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className={`grid w-full min-w-max ${isAdmin ? 'grid-cols-7' : 'grid-cols-5'}`}>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2" disabled={!isAdmin}>
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Mahasiswa</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2" disabled={!isAdmin}>
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Mata Kuliah</span>
              </TabsTrigger>
              <TabsTrigger value="schedules" className="flex items-center gap-2" disabled={!isAdmin}>
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Jadwal</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Absensi</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Laporan</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span className="hidden sm:inline">User</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">Mahasiswa terdaftar</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Mata Kuliah</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">Mata kuliah aktif</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jadwal</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSchedules}</div>
                  <p className="text-xs text-muted-foreground">Jadwal perkuliahan</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.attendanceRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Rata-rata kehadiran</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Status Kehadiran
                  </CardTitle>
                  <CardDescription>Distribusi status kehadiran mahasiswa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-sm">Hadir</span>
                      </div>
                      <span className="font-semibold">{stats.presentCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <span className="text-sm">Sakit</span>
                      </div>
                      <span className="font-semibold">{stats.sickCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm">Izin</span>
                      </div>
                      <span className="font-semibold">{stats.permissionCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-sm">Alpha</span>
                      </div>
                      <span className="font-semibold">{stats.absentCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Jadwal Hari Ini
                  </CardTitle>
                  <CardDescription>Perkuliahan yang berlangsung hari ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {schedules.filter(s => s.day === DAYS[new Date().getDay() - 1]).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Tidak ada jadwal hari ini
                      </p>
                    ) : (
                      schedules
                        .filter(s => s.day === DAYS[new Date().getDay() - 1])
                        .map((schedule) => (
                          <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="font-medium">{schedule.course.name}</p>
                              <p className="text-sm text-muted-foreground">{schedule.course.lecturer}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{schedule.startTime} - {schedule.endTime}</p>
                              <p className="text-xs text-muted-foreground">{schedule.room || "-"}</p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {!isAdmin && isDosen && (
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm">
                      <span className="font-medium">Mode Dosen:</span> Anda hanya dapat mengambil absensi dan melihat laporan.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Students Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="students" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari mahasiswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={studentDialogOpen} onOpenChange={(open) => {
                  setStudentDialogOpen(open);
                  if (!open) {
                    setEditingStudent(null);
                    setStudentForm({ nim: "", name: "", email: "", phone: "", class: "" });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Mahasiswa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingStudent ? "Edit Mahasiswa" : "Tambah Mahasiswa Baru"}</DialogTitle>
                      <DialogDescription>
                        {editingStudent ? "Perbarui data mahasiswa" : "Masukkan data mahasiswa baru"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nim">NIM *</Label>
                        <Input
                          id="nim"
                          value={studentForm.nim}
                          onChange={(e) => setStudentForm({ ...studentForm, nim: e.target.value })}
                          placeholder="Contoh: 2021001"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                          id="name"
                          value={studentForm.name}
                          onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                          placeholder="Nama lengkap mahasiswa"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input
                          id="phone"
                          value={studentForm.phone}
                          onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="class">Kelas</Label>
                        <Input
                          id="class"
                          value={studentForm.class}
                          onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                          placeholder="Contoh: A, B, C"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setStudentDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={editingStudent ? handleUpdateStudent : handleAddStudent}>
                        {editingStudent ? "Perbarui" : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NIM</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Telepon</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchedStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            {students.length === 0 ? "Belum ada data mahasiswa" : "Tidak ada mahasiswa yang ditemukan"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        searchedStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.nim}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{student.email || "-"}</TableCell>
                            <TableCell className="hidden lg:table-cell">{student.phone || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{student.class || "-"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingStudent(student);
                                    setStudentForm({
                                      nim: student.nim,
                                      name: student.name,
                                      email: student.email || "",
                                      phone: student.phone || "",
                                      class: student.class || "",
                                    });
                                    setStudentDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus Mahasiswa?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Data mahasiswa {student.name} akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Hapus
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Courses Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="courses" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari mata kuliah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={courseDialogOpen} onOpenChange={(open) => {
                  setCourseDialogOpen(open);
                  if (!open) {
                    setEditingCourse(null);
                    setCourseForm({ code: "", name: "", credits: 3, lecturer: "", semester: 1 });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Mata Kuliah
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingCourse ? "Edit Mata Kuliah" : "Tambah Mata Kuliah Baru"}</DialogTitle>
                      <DialogDescription>
                        {editingCourse ? "Perbarui data mata kuliah" : "Masukkan data mata kuliah baru"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="code">Kode Mata Kuliah *</Label>
                        <Input
                          id="code"
                          value={courseForm.code}
                          onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                          placeholder="Contoh: IF2301"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="courseName">Nama Mata Kuliah *</Label>
                        <Input
                          id="courseName"
                          value={courseForm.name}
                          onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                          placeholder="Nama mata kuliah"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="credits">SKS</Label>
                          <Input
                            id="credits"
                            type="number"
                            min={1}
                            max={6}
                            value={courseForm.credits}
                            onChange={(e) => setCourseForm({ ...courseForm, credits: parseInt(e.target.value) || 3 })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="semester">Semester</Label>
                          <Select
                            value={courseForm.semester.toString()}
                            onValueChange={(value) => setCourseForm({ ...courseForm, semester: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                <SelectItem key={s} value={s.toString()}>
                                  Semester {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lecturer">Dosen Pengampu</Label>
                        <Input
                          id="lecturer"
                          value={courseForm.lecturer}
                          onChange={(e) => setCourseForm({ ...courseForm, lecturer: e.target.value })}
                          placeholder="Nama dosen pengampu"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCourseDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={editingCourse ? handleUpdateCourse : handleAddCourse}>
                        {editingCourse ? "Perbarui" : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchedCourses.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-8">
                    {courses.length === 0 ? "Belum ada data mata kuliah" : "Tidak ada mata kuliah yang ditemukan"}
                  </div>
                ) : (
                  searchedCourses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{course.name}</CardTitle>
                            <CardDescription>{course.code}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingCourse(course);
                                setCourseForm({
                                  code: course.code,
                                  name: course.name,
                                  credits: course.credits,
                                  lecturer: course.lecturer || "",
                                  semester: course.semester,
                                });
                                setCourseDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Mata Kuliah?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Data mata kuliah {course.name} akan dihapus permanen.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCourse(course.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{course.credits} SKS</Badge>
                          <Badge variant="outline">Semester {course.semester}</Badge>
                        </div>
                        {course.lecturer && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Dosen: {course.lecturer}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          {/* Schedules Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="schedules" className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={scheduleDialogOpen} onOpenChange={(open) => {
                  setScheduleDialogOpen(open);
                  if (!open) {
                    setEditingSchedule(null);
                    setScheduleForm({ courseId: "", day: "Senin", startTime: "08:00", endTime: "10:00", room: "" });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Jadwal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingSchedule ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
                      <DialogDescription>
                        {editingSchedule ? "Perbarui data jadwal" : "Masukkan data jadwal baru"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="courseId">Mata Kuliah *</Label>
                        <Select
                          value={scheduleForm.courseId}
                          onValueChange={(value) => setScheduleForm({ ...scheduleForm, courseId: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih mata kuliah" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.code} - {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="day">Hari</Label>
                        <Select
                          value={scheduleForm.day}
                          onValueChange={(value) => setScheduleForm({ ...scheduleForm, day: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startTime">Jam Mulai</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={scheduleForm.startTime}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endTime">Jam Selesai</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={scheduleForm.endTime}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="room">Ruangan</Label>
                        <Input
                          id="room"
                          value={scheduleForm.room}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
                          placeholder="Contoh: R101, Lab Komputer"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}>
                        {editingSchedule ? "Perbarui" : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {DAYS.map((day) => {
                  const daySchedules = schedules.filter((s) => s.day === day);
                  if (daySchedules.length === 0) return null;
                  
                  return (
                    <Card key={day}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CalendarDays className="h-5 w-5" />
                          {day}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {daySchedules.map((schedule) => (
                            <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm font-medium">{schedule.startTime} - {schedule.endTime}</span>
                                </div>
                                <div>
                                  <p className="font-medium">{schedule.course.name}</p>
                                  <p className="text-sm text-muted-foreground">{schedule.course.code} | {schedule.course.lecturer}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {schedule.room && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {schedule.room}
                                  </div>
                                )}
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingSchedule(schedule);
                                      setScheduleForm({
                                        courseId: schedule.courseId,
                                        day: schedule.day,
                                        startTime: schedule.startTime,
                                        endTime: schedule.endTime,
                                        room: schedule.room || "",
                                      });
                                      setScheduleDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Jadwal {schedule.course.name} akan dihapus permanen.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteSchedule(schedule.id)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Hapus
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {schedules.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Belum ada data jadwal
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Attendance Tab - All users */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Ambil Absensi
                </CardTitle>
                <CardDescription>Pilih mata kuliah, jadwal, dan tanggal untuk mengambil absensi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="grid gap-2">
                    <Label>Mata Kuliah</Label>
                    <Select
                      value={attendanceForm.courseId}
                      onValueChange={(value) => {
                        setAttendanceForm({ ...attendanceForm, courseId: value, scheduleId: "" });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata kuliah" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Jadwal</Label>
                    <Select
                      value={attendanceForm.scheduleId}
                      onValueChange={(value) => setAttendanceForm({ ...attendanceForm, scheduleId: value })}
                      disabled={!attendanceForm.courseId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jadwal" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseSchedules.map((schedule) => (
                          <SelectItem key={schedule.id} value={schedule.id}>
                            {schedule.day} ({schedule.startTime} - {schedule.endTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tanggal</Label>
                    <Input
                      type="date"
                      value={attendanceForm.date}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                      max={today}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Kelas</Label>
                    <Select
                      value={attendanceForm.class}
                      onValueChange={(value) => setAttendanceForm({ ...attendanceForm, class: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Semua kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Semua Kelas</SelectItem>
                        {Array.from(new Set(students.map(s => s.class).filter(Boolean))).map((cls) => (
                          <SelectItem key={cls as string} value={cls as string}>
                            Kelas {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="invisible">Load</Label>
                    <Button onClick={fetchAttendanceByDate} disabled={!attendanceForm.courseId || !attendanceForm.date}>
                      <Search className="h-4 w-4 mr-2" />
                      Muat Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {attendances.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => handleBulkAttendance("hadir")}>
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Semua Hadir
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAttendance("sakit")}>
                  <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                  Semua Sakit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAttendance("izin")}>
                  <HelpCircle className="h-4 w-4 mr-1 text-blue-500" />
                  Semua Izin
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAttendance("alpha")}>
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  Semua Alpha
                </Button>
              </div>
            )}

            {filteredStudents.length > 0 && attendanceForm.courseId && attendanceForm.date && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>NIM</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student, index) => {
                        const attendance = attendances.find(a => a.studentId === student.id);
                        const currentStatus = attendance?.status || "";
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{student.nim}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{student.class || "-"}</Badge>
                            </TableCell>
                            <TableCell>
                              {currentStatus && (
                                <Badge className={`${STATUS_OPTIONS.find(s => s.value === currentStatus)?.color} text-white`}>
                                  {STATUS_OPTIONS.find(s => s.value === currentStatus)?.label}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {STATUS_OPTIONS.map((status) => {
                                  const Icon = status.icon;
                                  return (
                                    <Button
                                      key={status.value}
                                      variant={currentStatus === status.value ? "default" : "outline"}
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleTakeAttendance(student.id, status.value)}
                                    >
                                      <Icon className="h-4 w-4" />
                                    </Button>
                                  );
                                })}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Tab - All users */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Rekap per Mahasiswa
                  </CardTitle>
                  <CardDescription>Lihat rekap kehadiran per mahasiswa</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NIM</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Hadir</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => {
                        const studentAttendances = attendances.filter(a => a.studentId === student.id);
                        const presentCount = studentAttendances.filter(a => a.status === "hadir").length;
                        const total = studentAttendances.length;
                        const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : "0.0";
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.nim}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{presentCount}</TableCell>
                            <TableCell>{total}</TableCell>
                            <TableCell>
                              <Badge variant={parseFloat(percentage) >= 75 ? "default" : "destructive"}>
                                {percentage}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                            Belum ada data
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Rekap per Mata Kuliah
                  </CardTitle>
                  <CardDescription>Lihat rekap kehadiran per mata kuliah</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mata Kuliah</TableHead>
                        <TableHead>Hadir</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => {
                        const courseAttendances = attendances.filter(a => a.courseId === course.id);
                        const presentCount = courseAttendances.filter(a => a.status === "hadir").length;
                        const total = courseAttendances.length;
                        const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : "0.0";
                        
                        return (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.name}</TableCell>
                            <TableCell>{presentCount}</TableCell>
                            <TableCell>{total}</TableCell>
                            <TableCell>
                              <Badge variant={parseFloat(percentage) >= 75 ? "default" : "destructive"}>
                                {percentage}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {courses.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                            Belum ada data
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Rekap per Kelas
                </CardTitle>
                <CardDescription>Lihat rekap kehadiran per kelas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Jumlah Mahasiswa</TableHead>
                      <TableHead>Total Hadir</TableHead>
                      <TableHead>Total Absensi</TableHead>
                      <TableHead>Persentase Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(new Set(students.map(s => s.class).filter(Boolean))).map((cls) => {
                      const classStudents = students.filter(s => s.class === cls);
                      const classAttendances = attendances.filter(a => classStudents.some(s => s.id === a.studentId));
                      const presentCount = classAttendances.filter(a => a.status === "hadir").length;
                      const total = classAttendances.length;
                      const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : "0.0";
                      
                      return (
                        <TableRow key={cls as string}>
                          <TableCell className="font-medium">Kelas {cls}</TableCell>
                          <TableCell>{classStudents.length}</TableCell>
                          <TableCell>{presentCount}</TableCell>
                          <TableCell>{total}</TableCell>
                          <TableCell>
                            <Badge variant={parseFloat(percentage) >= 75 ? "default" : "destructive"}>
                              {percentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {students.filter(s => s.class).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          Belum ada data kelas
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab - Admin Only */}
          {isAdmin && (
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-end">
                <Dialog open={userDialogOpen} onOpenChange={(open) => {
                  setUserDialogOpen(open);
                  if (!open) {
                    setEditingUser(null);
                    setUserForm({ username: "", password: "", name: "", email: "", role: "dosen" });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingUser ? "Edit User" : "Tambah User Baru"}</DialogTitle>
                      <DialogDescription>
                        {editingUser ? "Perbarui data user" : "Masukkan data user baru"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={userForm.username}
                          onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                          placeholder="Username untuk login"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password {editingUser ? "(kosongkan jika tidak diubah)" : "*"}</Label>
                        <Input
                          id="password"
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                          placeholder="Password"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="userName">Nama Lengkap *</Label>
                        <Input
                          id="userName"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          placeholder="Nama lengkap"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={userForm.role}
                          onValueChange={(value) => setUserForm({ ...userForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin (Full Access)</SelectItem>
                            <SelectItem value="dosen">Dosen (Absensi Only)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setUserDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
                        {editingUser ? "Perbarui" : "Simpan"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            Belum ada data user
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{user.email || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role === "admin" ? "Admin" : "Dosen"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingUser(user);
                                    setUserForm({
                                      username: user.username,
                                      password: "",
                                      name: user.name,
                                      email: user.email || "",
                                      role: user.role,
                                    });
                                    setUserDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        User {user.name} akan dihapus permanen.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Hapus
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 py-4 text-center text-sm text-muted-foreground border-t">
          <p>Sistem Absensi Perkuliahan &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default AttendanceApp;
