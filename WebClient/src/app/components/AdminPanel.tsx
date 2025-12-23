import { useState } from 'react';
import type { Course } from './CoursesPage';
import type { Video } from './CourseVideos';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AdminPanelProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id' | 'videosCount'>) => void;
  onDeleteCourse: (courseId: string) => void;
  onEditCourse: (courseId: string) => void;
}

export function AdminPanel({ 
  courses, 
  onAddCourse, 
  onDeleteCourse,
  onEditCourse
}: AdminPanelProps) {
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseForm.title && courseForm.description && courseForm.imageUrl) {
      onAddCourse(courseForm);
      setCourseForm({ title: '', description: '', imageUrl: '' });
      setShowCourseForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-8 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <h1 className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[36px] md:text-[60px] text-[#150303] text-center mb-8 md:mb-12">
          АДМИН-ПАНЕЛЬ
        </h1>

        {/* Course Management */}
        <div className="bg-white rounded-[20px] p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4">
            <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[24px] md:text-[30px] text-[#262626]">
              Управление курсами
            </h2>
            <button
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="bg-[#8bcf85] rounded-[15px] px-4 md:px-6 py-2 md:py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#262626] hover:opacity-80 transition-opacity w-full md:w-auto"
            >
              {showCourseForm ? 'Отменить' : '+ Добавить курс'}
            </button>
          </div>

          {showCourseForm && (
            <form onSubmit={handleAddCourse} className="mb-6 md:mb-8 p-4 md:p-6 bg-[#f5f5f5] rounded-[15px]">
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Название курса"
                  className="border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none"
                />
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Описание курса"
                  rows={3}
                  className="border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none resize-none"
                />
                <input
                  type="text"
                  value={courseForm.imageUrl}
                  onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                  placeholder="URL изображения"
                  className="border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#6495ed] rounded-[15px] py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-white hover:opacity-90"
                >
                  Создать курс
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border-2 border-[#a3a3a3] rounded-[15px] p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                  <div className="w-full md:w-32 h-40 md:h-32 flex-shrink-0 rounded-[15px] overflow-hidden">
                    <ImageWithFallback
                      alt={course.title}
                      className="w-full h-full object-cover"
                      src={course.imageUrl}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[20px] md:text-[24px] text-[#262626] mb-2">
                      {course.title}
                    </h3>
                    <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#262626] mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#6495ed]">
                      Видео: {course.videosCount}
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 md:gap-3 w-full md:w-auto">
                    <button
                      onClick={() => onEditCourse(course.id)}
                      className="flex-1 md:flex-none bg-[#6495ed] rounded-[10px] px-4 py-2 font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-white hover:opacity-80 whitespace-nowrap"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => onDeleteCourse(course.id)}
                      className="flex-1 md:flex-none bg-[#ff6b6b] rounded-[10px] px-4 py-2 font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-white hover:opacity-80"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}