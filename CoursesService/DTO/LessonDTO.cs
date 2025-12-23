namespace CoursesService.DTO
{
    public class LessonDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public TimeSpan Duration { get; set; }

        // ВАЖНО: уже presigned URL
        public string VideoUrl { get; set; } = null!;
    }

}
