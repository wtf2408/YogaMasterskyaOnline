using System.ComponentModel.DataAnnotations;

namespace VideoService.Models
{
    public class VideoMapping
    {
        [Key]
        public string VideoId { get; set; } = null!;

        [Required]
        public string KeyPrefix { get; set; } = null!;

        public string? OriginalFileName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
