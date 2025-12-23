using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CoursesService.Models
{
    public class Course
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
    }
}
