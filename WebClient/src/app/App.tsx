import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import {
  CoursesPage,
  type Course,
} from "./components/CoursesPage";
import {
  CourseVideos,
  type Video,
} from "./components/CourseVideos";
import { AdminPanel } from "./components/AdminPanel";
import { CourseEdit } from "./components/CourseEdit";

type Page =
  | "login"
  | "courses"
  | "course-videos"
  | "admin"
  | "course-edit";

interface User {
  username: string;
  isAdmin: boolean;
  token: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Record<string, Video[]>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const API_URL = "http://localhost:5198"; // замените на ваш сервер

  // =================== API ===================

  const handleLogin = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Неверный логин или пароль");

      const data = await res.json();
      const user: User = {
        username: data.username,
        isAdmin: data.isAdmin,
        token: data.token,
      };

      setCurrentUser(user);
      setCurrentPage(user.isAdmin ? "admin" : "courses");
      fetchCourses(user.token);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchCourses = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Не удалось получить курсы");
      const data: Course[] = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideos = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}/lessons`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (!res.ok) throw new Error("Не удалось получить видео");
      const data: Video[] = await res.json();
      setVideos((prev) => ({ ...prev, [courseId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourse = async (course: Omit<Course, "id">) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(course),
      });
      if (!res.ok) throw new Error("Не удалось добавить курс");
      const newCourse: Course = await res.json();
      setCourses((prev) => [...prev, newCourse]);
      setVideos((prev) => ({ ...prev, [newCourse.id]: [] }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateCourse = async (
    courseId: string,
    updates: Partial<Omit<Course, "id">>
  ) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Не удалось обновить курс");
      const updated: Course = await res.json();
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? updated : c))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (!res.ok) throw new Error("Не удалось удалить курс");
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      setVideos((prev) => {
        const newVideos = { ...prev };
        delete newVideos[courseId];
        return newVideos;
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  interface NewVideoForm {
    title: string;
    description?: string;
    duration: string;
    videoFile: File;
  }

  const handleAddVideo = async (
  courseId: string,
  video: NewVideoForm
) => {
  if (!currentUser) return;

  if (!video.title || !video.duration || !video.videoFile) {
    alert("Пожалуйста, заполните все обязательные поля и выберите видео-файл");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("Title", video.title);
    formData.append("Description", video.description || "");
    formData.append("Duration", video.duration);
    formData.append("CourseId", courseId);
    formData.append("Video", video.videoFile);

    const res = await fetch(`${API_URL}/api/Lessons`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Не удалось добавить видео");

    // lessonId вернулся, теперь просто перезагрузим список видео
    const videosRes = await fetch(`${API_URL}/api/courses/${courseId}/videos`);
    if (!videosRes.ok) throw new Error("Не удалось загрузить список видео");

    const updatedVideos: Video[] = await videosRes.json();

    setVideos((prev) => ({
      ...prev,
      [courseId]: updatedVideos,
    }));

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, videosCount: updatedVideos.length }
          : c
      )
    );
  } catch (err: any) {
    alert(err.message);
  }
};



  const handleDeleteVideo = async (courseId: string, videoId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_URL}/api/Lessons/${videoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (!res.ok) throw new Error("Не удалось удалить видео");

      setVideos((prev) => ({
        ...prev,
        [courseId]: prev[courseId].filter((v) => v.id !== videoId),
      }));

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? { ...c, videosCount: (prev[courseId] || []).length - 1 }
            : c
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // =================== Навигация ===================

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
    setSelectedCourseId(null);
    setCourses([]);
    setVideos({});
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    fetchVideos(courseId);
    setCurrentPage("course-videos");
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setCurrentPage("courses");
  };

  const handleEditCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    fetchVideos(courseId);
    setCurrentPage("course-edit");
  };

  const handleBackToAdmin = () => {
    setSelectedCourseId(null);
    setCurrentPage("admin");
  };

  const getCourseVideos = (courseId: string): Video[] => {
    return videos[courseId] || [];
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // =================== Render ===================

  return (
    <div className="min-h-screen flex flex-col">
      {currentPage !== "login" && (
        <Header
          onNavigate={(page: string) => setCurrentPage(page as Page)}
          currentPage={currentPage}
          userName={currentUser?.username}
          isAdmin={currentUser?.isAdmin}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "login" && <Login onLogin={handleLogin} />}

      {currentPage === "courses" && (
        <CoursesPage
          courses={courses}
          onSelectCourse={handleSelectCourse}
        />
      )}

      {currentPage === "course-videos" && selectedCourse && (
        <CourseVideos
          courseTitle={selectedCourse.title}
          videos={getCourseVideos(selectedCourse.id)}
          onBack={handleBackToCourses}
        />
      )}

      {currentPage === "admin" && currentUser?.isAdmin && (
        <AdminPanel
          courses={courses}
          onAddCourse={handleAddCourse}
          onDeleteCourse={handleDeleteCourse}
          onEditCourse={handleEditCourse}
        />
      )}

      {currentPage === "course-edit" &&
        selectedCourse &&
        currentUser?.isAdmin && (
          <CourseEdit
            course={selectedCourse}
            videos={getCourseVideos(selectedCourse.id)}
            onBack={handleBackToAdmin}
            onUpdateCourse={handleUpdateCourse}
            onAddVideo={handleAddVideo}
            onDeleteVideo={handleDeleteVideo}
          />
        )}

      {currentPage !== "login" && <Footer />}
    </div>
  );
}
