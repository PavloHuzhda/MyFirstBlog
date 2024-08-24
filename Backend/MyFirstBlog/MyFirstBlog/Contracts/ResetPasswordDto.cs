namespace MyFirstBlog.Contracts
{
    public record ResetPasswordDto(string Email, string Token, string Password);    
}
