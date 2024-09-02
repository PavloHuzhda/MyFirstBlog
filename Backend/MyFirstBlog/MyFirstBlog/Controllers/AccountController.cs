using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MyFirstBlog.Contracts;
using MyFirstBlog.Models;
using MyFirstBlog.Services;
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
        private readonly IEmailService _emailService;


        public AccountController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            IEmailService emailService
            )
        {
            _config = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            var user = new User { FirstName = registerRequest.FirstName, LastName = registerRequest.LastName, UserName = registerRequest.UserName, Email = registerRequest.Email };
            var result = await _userManager.CreateAsync(user, registerRequest.Password);

            if (result.Succeeded)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { token, email = user.Email }, Request.Scheme)
                    .Replace("https://localhost:7046/api/Account/confirm-email", "http://localhost:5173/confirm-email");

                string message = $"<html><body><p>Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.</p></body></html>";
                await _emailService.SendEmailAsync(user.Email, "Confirm your email", message);

                return Ok("Registration successful. Please check your email to confirm your account.");
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("Invalid email address.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return Ok("Email confirmed successfully!");
            }

            return BadRequest("Error confirming email.");
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var user = await _userManager.FindByEmailAsync(loginRequest.UserNameOrEmail)
                       ?? await _userManager.FindByNameAsync(loginRequest.UserNameOrEmail); // Check by email or username

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                return Unauthorized("Invalid credentials.");
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                // Resend confirmation email
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { token, email = user.Email }, Request.Scheme)
                    .Replace("https://localhost:7046/api/Account/confirm-email", "http://localhost:5173/confirm-email");

                string message = $"<html><body><p>Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.</p></body></html>";
                await _emailService.SendEmailAsync(user.Email, "Confirm your email", message);

                return BadRequest("Your email has not been confirmed. A new confirmation email has been sent to your address.");
            }

            // Generate JWT token for the user as before
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
            var tokenJWT = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { Token = tokenHandler.WriteToken(tokenJWT) });
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                return BadRequest("Invalid request.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);


            // Generate the URL with token and email as part of the route
            //var resetLink = $"{Request.Scheme}://localhost:5173/reset-password/{Uri.EscapeDataString(token)}/{model.Email}";

            var resetLink = Url.Action("ResetPassword", "account", new { token, email = user.Email }, Request.Scheme, Request.Host.ToString())
            .Replace("https://localhost:7046/api/Account/reset-password", "http://localhost:5173/reset-password");

            // Send the reset link via email
            await _emailService.SendEmailAsync(model.Email, "Password Reset", $"Reset your password by clicking here: <a href='{resetLink}'>clicking here</a>.");

            return Ok();
        }



        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Invalid request.");
            }

            var resetPassResult = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            if (!resetPassResult.Succeeded)
            {
                // Detailed error messages for better debugging
                var errors = string.Join(", ", resetPassResult.Errors.Select(e => e.Description));
                return BadRequest($"Error resetting password: {errors}");
            }

            return Ok("Password has been reset successfully.");
        }     


    }
}
