using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyFirstBlog.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MyFirstBlog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _config;

        public AccountController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration
            )
        {
            _config = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {
            var user = new User { UserName = registerModel.UserName, Email = registerModel.Email, FirstName = registerModel.FirstName, LastName = registerModel.LastName };
            var result = await _userManager.CreateAsync(user, registerModel.Password);

            if (result.Succeeded)
            {
                return Ok(new { Result = "Registration successful" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel) 
        {
            //var result = await _signInManager.PasswordSignInAsync(loginModel.Email, loginModel.Password, false, false);

            //if (result.Succeeded)
            //{
            //    var user = await _userManager.FindByEmailAsync(loginModel.Email);
            //    var token = GenerateJwtToken(user);

            //    return Ok(new { Token = token });
            //}

            var user = await _userManager.FindByEmailAsync(loginModel.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _config["Jwt:Issuer"],
                    Audience = _config["Jwt:Issuer"]
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new { Token = tokenHandler.WriteToken(token) });
            }

            return Unauthorized();
        }

        private string GenerateJwtToken(User user) 
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
