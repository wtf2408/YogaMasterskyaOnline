using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CoursesService.Models
{
    public class Lesson
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public Guid VideoId { get; set; }

        [Required]
        public TimeSpan Duration { get; set; }

        [Required]
        [ForeignKey("Course")]
        public Guid CourseId { get; set; }
        [JsonIgnore]
        public Course? Course { get; set; }
    }
}
