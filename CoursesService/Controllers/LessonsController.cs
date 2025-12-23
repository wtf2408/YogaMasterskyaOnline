using CoursesService.Data;
using CoursesService.DTO;
using CoursesService.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VideoService.Grpc;
using static VideoService.Grpc.VideoService;

namespace CoursesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LessonsController : ControllerBase
    {
        private readonly CourceServiceContext _context;

        public LessonsController(CourceServiceContext context)
        {
            _context = context;
        }

        // GET: api/lessons
        [HttpGet("/api/courses/{courseId:guid}/lessons")]
        public async Task<IActionResult> GetLessonsByCourse(Guid courseId,
                                                            VideoServiceClient videoClient)
        {
            var lessons = await _context.Lesson
                .Where(l => l.CourseId == courseId)
                .ToListAsync();

            var grpcResponse = await videoClient.BatchGetPlaybackUrlsAsync(
                new BatchGetPlaybackUrlsRequest
                {
                    VideoIds = { lessons.Select(l => l.VideoId.ToString()) }
                });

            var urlMap = grpcResponse.Items
                .ToDictionary(x => Guid.Parse(x.VideoId), x => x.HlsUrl);

            var result = lessons.Select(l => new LessonDto
            {
                Id = l.Id,
                Title = l.Title,
                Description = l.Description,
                Duration = l.Duration,
                VideoUrl = urlMap[l.VideoId]
            });

            return Ok(result);
        }


        // GET: api/lessons/{id}
        [HttpGet("{lessonId:guid}")]
        public async Task<IActionResult> GetLesson(Guid lessonId,
                                                   VideoServiceClient videoClient)
        {
            var lesson = await _context.Lesson.FindAsync(lessonId);
            if (lesson == null) return NotFound();

            var grpcResponse = await videoClient.GetPlaybackUrlAsync(
                new GetPlaybackUrlRequest
                {
                    VideoId = lesson.VideoId.ToString()
                });

            return Ok(new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                Description = lesson.Description,
                Duration = lesson.Duration,
                VideoUrl = grpcResponse.HlsUrl
            });
        }


        // POST: api/lessons
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateLessonDTO request,
                                                VideoServiceClient videoClient)
        {
            // Создаём streaming вызов
            using var call = videoClient.UploadVideo();

            // Отправляем первый пакет с именем файла
            await call.RequestStream.WriteAsync(new UploadVideoRequest
            {
                Filename = request.Video.FileName
            });

            // Отправляем файл кусками (например, 64 KB)
            var buffer = new byte[64 * 1024];
            await using var fs = request.Video.OpenReadStream();
            int bytesRead;
            while ((bytesRead = await fs.ReadAsync(buffer, 0, buffer.Length)) > 0)
            {
                await call.RequestStream.WriteAsync(new UploadVideoRequest
                {
                    ChunkData = Google.Protobuf.ByteString.CopyFrom(buffer, 0, bytesRead)
                });
            }

            // Завершаем поток
            await call.RequestStream.CompleteAsync();

            // Получаем ответ от сервера
            var grpcResponse = await call.ResponseAsync;

            // Создаём запись в базе
            var lesson = new Lesson
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Description = request.Description,
                Duration = request.Duration,
                CourseId = request.CourseId,
                VideoId = Guid.Parse(grpcResponse.VideoId)
            };

            _context.Lesson.Add(lesson);
            await _context.SaveChangesAsync();

            return Created("", new { lessonId = lesson.Id });
        }

        // PATCH: api/lessons/{id}
        //[HttpPatch("{id:guid}")]
        //public async Task<IActionResult> Update(Guid id, Lesson updatedLesson)
        //{
        //    var lesson = await _context.Lesson.FindAsync(id);
        //    if (lesson == null) return NotFound();

        //    lesson.Title = updatedLesson.Title ?? lesson.Title;
        //    lesson.Description = updatedLesson.Description ?? lesson.Description;
        //    lesson.VideoUrl = updatedLesson.VideoUrl ?? lesson.VideoUrl;
        //    lesson.Duration = updatedLesson.Duration != default ? updatedLesson.Duration : lesson.Duration;
        //    lesson.CourseId = updatedLesson.CourseId != default ? updatedLesson.CourseId : lesson.CourseId;

        //    await _context.SaveChangesAsync();
        //    return NoContent();
        //}

        // DELETE: api/lessons/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var lesson = await _context.Lesson.FindAsync(id);
            if (lesson == null) return NotFound();

            _context.Lesson.Remove(lesson);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
