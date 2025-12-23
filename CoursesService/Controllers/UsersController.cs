using Microsoft.AspNetCore.Mvc;
using CoursesService.DTO;
using CoursesService.Models;
using Microsoft.AspNetCore.Authorization;
using CoursesService.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography;
using System.Text;

namespace CoursesService.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly CourceServiceContext _db;

        public UsersController(CourceServiceContext db)
        {
            _db = db;
        }


        [HttpPost]
        public async Task<ActionResult<User>> Create(UserDTO dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("User with this email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow,
                PasswordHash = HashPassword(dto.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAll()
        {
            return await _db.Users
                .AsNoTracking()
                .ToListAsync();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<User>> GetById(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return user;
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UserDTO dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Email = dto.Email;
            user.Role = dto.Role;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.PasswordHash = HashPassword(dto.Password);

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }

}
