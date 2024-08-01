using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MyFirstBlog.Models
{
    public class Blog(DbContextOptions<Blog> options) : IdentityDbContext<User>(options)
    {
    }
}
