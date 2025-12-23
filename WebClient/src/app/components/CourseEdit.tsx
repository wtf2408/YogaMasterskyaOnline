import { useState } from 'react';
import type { Course } from './CoursesPage';
import type { Video } from './CourseVideos';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface NewVideoForm {
  title: string;
  description?: string;
  duration: string;
  videoFile: File;
}

interface CourseEditProps {
  course: Course;
  videos: Video[];
  onBack: () => void;
  onUpdateCourse: (courseId: string, updates: Partial<Omit<Course, 'id' | 'videosCount'>>) => void;
   onAddVideo: (courseId: string, video: NewVideoForm) => void;
  onDeleteVideo: (courseId: string, videoId: string) => void;
}

export function CourseEdit({ 
  course, 
  videos, 
  onBack, 
  onUpdateCourse, 
  onAddVideo, 
  onDeleteVideo 
}: CourseEditProps) {
  const [editMode, setEditMode] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoFile: null as File | null,
    duration: ''
  });

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCourse(course.id, courseForm);
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setCourseForm({
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl
    });
    setEditMode(false);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
  
    const file = videoForm.videoFile;
    if (!file) {
      alert("Пожалуйста, выберите видео-файл");
      return;
    }
    onAddVideo(course.id, {
      title: videoForm.title,
      description: videoForm.description,
      duration: videoForm.duration,
      videoFile: file
    });

  
    setVideoForm({ title: '', description: '', videoFile: null, duration: '' });
    setShowVideoForm(false);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoForm({ ...videoForm, videoFile: file });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-8 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <button
          onClick={onBack}
          className="bg-[#262626] rounded-[15px] px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-center text-white hover:opacity-80 transition-opacity"
        >
          ← Назад к списку курсов
        </button>

        <h1 className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[36px] md:text-[60px] text-[#150303] text-center mb-8 md:mb-12">
          РЕДАКТИРОВАНИЕ КУРСА
        </h1>

        {/* Course Info Section */}
        <div className="bg-white rounded-[20px] p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4">
            <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[24px] md:text-[30px] text-[#262626]">
              Информация о курсе
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#6495ed] rounded-[15px] px-4 md:px-6 py-2 md:py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-white hover:opacity-80 transition-opacity w-full md:w-auto"
              >
                Редактировать
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="rounded-[20px] overflow-hidden h-[300px] md:h-[400px]">
                <ImageWithFallback
                  alt={course.title}
                  className="w-full h-full object-cover"
                  src={course.imageUrl}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#6495ed] mb-2">
                    Название курса
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[24px] md:text-[28px] text-[#262626]">
                    {course.title}
                  </p>
                </div>

                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#6495ed] mb-2">
                    Описание
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[18px] md:text-[20px] text-[#262626]">
                    {course.description}
                  </p>
                </div>

                <div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#6495ed] mb-2">
                    Количество видео
                  </p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[20px] md:text-[24px] text-[#262626]">
                    {course.videosCount}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateCourse}>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#262626] mb-2 block">
                    Название курса
                  </label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="Название курса"
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none"
                  />
                </div>

                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#262626] mb-2 block">
                    Описание курса
                  </label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Описание курса"
                    rows={4}
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#262626] mb-2 block">
                    URL изображения
                  </label>
                  <input
                    type="text"
                    value={courseForm.imageUrl}
                    onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                    placeholder="URL изображения"
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] focus:border-[#6495ed] outline-none"
                  />
                </div>

                {courseForm.imageUrl && (
                  <div className="rounded-[20px] overflow-hidden h-[250px] md:h-[300px]">
                    <ImageWithFallback
                      alt="Предварительный просмотр"
                      className="w-full h-full object-cover"
                      src={courseForm.imageUrl}
                    />
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#8bcf85] rounded-[15px] py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#262626] hover:opacity-80"
                  >
                    Сохранить изменения
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 bg-[#a3a3a3] rounded-[15px] py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-white hover:opacity-80"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Videos Section */}
        <div className="bg-white rounded-[20px] p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4">
            <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[24px] md:text-[30px] text-[#262626]">
              Видео-уроки
            </h2>
            <button
              onClick={() => setShowVideoForm(!showVideoForm)}
              className="bg-[#8bcf85] rounded-[15px] px-4 md:px-6 py-2 md:py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#262626] hover:opacity-80 transition-opacity w-full md:w-auto"
            >
              {showVideoForm ? 'Отменить' : '+ Добавить видео'}
            </button>
          </div>

          {showVideoForm && (
            <form onSubmit={handleAddVideo} className="mb-6 md:mb-8 p-4 md:p-6 bg-[#f5f5f5] rounded-[15px]">
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#262626] mb-2 block">
                    Название видео
                  </label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    placeholder="Название видео"
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] focus:border-[#6495ed] outline-none"
                  />
                </div>

                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#262626] mb-2 block">
                    Описание видео
                  </label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    placeholder="Описание видео"
                    rows={3}
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] focus:border-[#6495ed] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#262626] mb-2 block">
                    Файл видео
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] focus:border-[#6495ed] outline-none"
                  />
                </div>

                <div>
                  <label className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#262626] mb-2 block">
                    Продолжительность
                  </label>
                  <input
                    type="text"
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                    placeholder="Например: 25 мин"
                    className="w-full border-2 border-[#a3a3a3] rounded-[15px] px-4 py-3 font-['Inter:Regular',sans-serif] text-[16px] focus:border-[#6495ed] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#6495ed] rounded-[15px] py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-white hover:opacity-90"
                >
                  Добавить видео
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3 md:gap-4">
            {videos.length === 0 ? (
              <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#a3a3a3] text-center py-8 md:py-12">
                В этом курсе пока нет видео-уроков
              </p>
            ) : (
              videos.map((video, index) => (
                <div
                  key={video.id}
                  className="border-2 border-[#a3a3a3] rounded-[15px] p-4 md:p-6 hover:border-[#6495ed] transition-colors"
                >
                  <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                    <span className="flex-shrink-0 bg-[#6495ed] text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] md:text-[20px]">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[18px] md:text-[22px] text-[#262626] mb-2">
                        {video.title}
                      </h3>
                      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#262626] mb-3">
                        {video.description}
                      </p>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#6495ed]">
                          ⏱ {video.duration}
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[14px] md:text-[16px] text-[#a3a3a3] break-all">
                          🔗 {video.videoUrl}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteVideo(course.id, video.id)}
                      className="flex-shrink-0 bg-[#ff6b6b] rounded-[15px] px-4 md:px-6 py-2 md:py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-white hover:opacity-80 transition-opacity w-full md:w-auto"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}