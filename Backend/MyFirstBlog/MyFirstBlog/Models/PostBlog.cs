using System.ComponentModel.DataAnnotations;

namespace MyFirstBlog.Models
{
    public class PostBlog
    {
        [Required]        
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
