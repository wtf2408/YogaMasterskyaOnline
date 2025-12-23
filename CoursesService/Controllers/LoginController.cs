using Microsoft.AspNetCore.Mvc;

namespace CoursesService.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            // ❗ ВРЕМЕННАЯ логика (без БД)
            // позже заменишь на нормальную авторизацию

            if (request.Username == "admin" && request.Password == "admin")
            {
                return Ok(new LoginResponseDto
                {
                    Username = "admin",
                    IsAdmin = true,
                    Token = "fake-admin-token"
                });
            }

            if (request.Username == "user" && request.Password == "user")
            {
                return Ok(new LoginResponseDto
                {
                    Username = "user",
                    IsAdmin = false,
                    Token = "fake-user-token"
                });
            }

            return Unauthorized("Неверный логин или пароль");
        }
    }


    public class LoginRequestDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginResponseDto
    {
        public string Username { get; set; } = null!;
        public bool IsAdmin { get; set; }
        public string? Token { get; set; }
    }
}
