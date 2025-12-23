using System.ComponentModel.DataAnnotations;

namespace CoursesService.DTO
{
    public class CreateLessonDTO
    {
        [Required]
        public string Title { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        public TimeSpan Duration { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        [Required]
        public IFormFile Video { get; set; } = null!;
    }
}
