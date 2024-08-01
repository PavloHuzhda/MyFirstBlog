using Microsoft.AspNetCore.Identity;

namespace MyFirstBlog.Models
{
    public class User : IdentityUser
    {        
        public string FirstName { get; set; }
        public string LastName { get; set; }        
    }
}
