using System.ComponentModel.DataAnnotations;

namespace MyFirstBlog.Contracts
{
    public class PostBlogRequest
    {
        [Required]        
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
