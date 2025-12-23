using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoursesService.Data;
using CoursesService.Models;

namespace CoursesService.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CoursesController : ControllerBase
    {
        private readonly CourceServiceContext _context;

        public CoursesController(CourceServiceContext context)
        {
            _context = context;
        }

        // GET /api/courses
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _context.Course.ToListAsync();
            return Ok(courses);
        }

        // GET /api/courses/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var course = await _context.Course.FindAsync(id);
            return course == null ? NotFound() : Ok(course);
        }

        // POST /api/courses
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Course course)
        {
            course.Id = Guid.NewGuid();

            _context.Course.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = course.Id }, course);
        }

        // PUT /api/courses/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] Course updated)
        {
            var course = await _context.Course.FindAsync(id);
            if (course == null) return NotFound();

            // заменяем все поля
            course.Title = updated.Title;
            course.Description = updated.Description;
            course.ImageUrl = updated.ImageUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH /api/courses/{id}
        [HttpPatch("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Course updated)
        {
            var course = await _context.Course.FindAsync(id);
            if (course == null) return NotFound();

            course.Title = updated.Title ?? course.Title;
            course.Description = updated.Description ?? course.Description;
            course.ImageUrl = updated.ImageUrl ?? course.ImageUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE /api/courses/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var course = await _context.Course.FindAsync(id);
            if (course == null) return NotFound();

            _context.Course.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET /api/courses/{courseId}/videos
        [HttpGet("{courseId:guid}/videos")]
        public async Task<IActionResult> GetLessonsByCourse(Guid courseId)
        {
            var lessons = await _context.Lesson
                .Where(l => l.CourseId == courseId)
                .ToListAsync();

            return Ok(lessons);
        }
    }
}
