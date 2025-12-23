import { useState } from 'react';
import { HlsPlayer } from './HlsPlayer';

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // presigned .m3u8
  duration: string;
  videoFileName?: string;
}

interface CourseVideosProps {
  courseTitle: string;
  videos: Video[];
  onBack: () => void;
}

export function CourseVideos({ courseTitle, videos, onBack }: CourseVideosProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-8 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-12">
        <button
          onClick={onBack}
          className="bg-[#262626] rounded-[15px] px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8 font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-center text-white hover:opacity-80 transition-opacity"
        >
          ← Назад к курсам
        </button>

        <h1 className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[36px] md:text-[60px] text-[#150303] text-center mb-8 md:mb-12">
          {courseTitle}
        </h1>

        {videos.length === 0 ? (
          <div className="text-center py-12 md:py-20">
            <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[24px] md:text-[30px] text-[#262626]">
              В этом курсе пока нет видео-уроков
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2 order-1">
              {selectedVideo && (
                <div className="bg-white rounded-[20px] overflow-hidden">
                  <div className="bg-black aspect-video">
                    <HlsPlayer src={selectedVideo.videoUrl} />
                  </div>

                  <div className="p-4 md:p-8">
                    <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[24px] md:text-[40px] text-black mb-3 md:mb-4">
                      {selectedVideo.title}
                    </h2>

                    <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[18px] md:text-[20px] text-[#262626] mb-3 md:mb-4">
                      {selectedVideo.description}
                    </p>

                    <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] md:text-[18px] text-[#6495ed]">
                      Продолжительность: {selectedVideo.duration}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video List */}
            <div className="lg:col-span-1 order-2">
              <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic text-[24px] md:text-[30px] text-[#262626] mb-4 md:mb-6">
                Уроки курса
              </h3>

              <div className="flex flex-col gap-3 md:gap-4">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`bg-white border-2 rounded-[15px] p-4 md:p-6 text-left transition-all duration-300 ${
                      selectedVideo?.id === video.id
                        ? 'border-[#6495ed] bg-[#6495ed] bg-opacity-10'
                        : 'border-[#a3a3a3] hover:border-[#6495ed]'
                    }`}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <span className="flex-shrink-0 bg-[#6495ed] text-white rounded-full w-8 h-8 flex items-center justify-center font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px]">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[16px] md:text-[18px] text-[#262626] mb-1 md:mb-2">
                          {video.title}
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[12px] md:text-[14px] text-[#6495ed]">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}