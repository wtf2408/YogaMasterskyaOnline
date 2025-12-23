import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videosCount: number;
}

interface CoursesPageProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export function CoursesPage({ courses, onSelectCourse }: CoursesPageProps) {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-8 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[40px] md:text-[60px] text-[#150303] text-center mb-8 md:mb-12">
          КУРСЫ ЙОГИ
        </h1>

        {courses.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[24px] md:text-[30px] text-[#262626]">
              Курсы пока не добавлены
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border-2 border-[#a3a3a3] rounded-[20px] overflow-hidden hover:border-[#6495ed] transition-all duration-300 course-card"
              >
                <div className="h-[300px] md:h-[400px] w-full">
                  <ImageWithFallback
                    alt={course.title}
                    className="w-full h-full object-cover"
                    src={course.imageUrl}
                  />
                </div>

                <div className="p-4 md:p-8">
                  <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[28px] md:text-[40px] text-black text-center mb-3 md:mb-4">
                    {course.title}
                  </h2>

                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[18px] md:text-[24px] text-black mb-4 md:mb-6">
                    {course.description}
                  </p>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#6495ed]">
                      Уроков: {course.videosCount}
                    </p>

                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="bg-[#6495ed] rounded-[15px] px-6 md:px-8 py-3 font-['Inter:Regular',sans-serif] font-normal not-italic text-[20px] md:text-[24px] text-center text-white hover:opacity-90 transition-opacity w-full md:w-auto"
                    >
                      Открыть курс
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}