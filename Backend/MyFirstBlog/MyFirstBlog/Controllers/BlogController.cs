using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyFirstBlog.Models;

namespace MyFirstBlog.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly BlogContext _blogContext;
        private readonly UserManager<User> _userManager;

        public BlogController(BlogContext context, UserManager<User> userManager)
        {
            _blogContext = context;
            _userManager = userManager;            
        }

        [HttpGet]        
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts(int pageNum = 1, int pageSize = 3) 
        {
            var user = await _userManager.GetUserAsync(User);
            var pagedBlogPosts = await _blogContext.BlogPosts
                .Where(post => post.IdUser == user.Id) // Filter by user ID
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalPosts = await _blogContext.BlogPosts
                .Where(post => post.IdUser == user.Id) // Filter by user ID
                .CountAsync();

            var response = new PagedModel<BlogPost>
            {
                Data = pagedBlogPosts,
                PageNumber = pageNum,
                PageSize = pageSize,
                TotalCount = totalPosts
            };
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPost>> GetBlogPost(Guid id) 
        {
            var blogPost = await _blogContext.BlogPosts.FindAsync(id);

            if (blogPost == null) 
            {
                return NotFound();
            }

            return blogPost;
        }

        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlogPost([FromBody] PostBlog postBlog) 
        {
            var user = await _userManager.GetUserAsync(User);
            var newPost = new BlogPost { Title = postBlog.Title, Content = postBlog.Content, CreatedDate = postBlog.CreatedAt, User = user, IdUser = user.Id };
            
            try
            {
                _blogContext.BlogPosts.Add(newPost);
                await _blogContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBlogPost), new { id = newPost.Id }, newPost);
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost(Guid id, [FromBody] UpdatePostBlog updatePostBlog)
        {
            if (id != updatePostBlog.Id)
            {
                return BadRequest("Blog post ID in URL does not match ID in request body.");
            }

            var user = await _userManager.GetUserAsync(User); // Get the authenticated user
            if (user == null)
            {
                return Unauthorized("You must be logged in to update a blog post.");
            }

            var blogPost = await _blogContext.BlogPosts.FindAsync(id);

            if (blogPost == null)
            {
                return NotFound("Blog post not found.");
            }

            if (blogPost.IdUser != user.Id)
            {
                return Forbid("You do not have permission to update this blog post.");
            }

            blogPost.Title = updatePostBlog.Title;
            blogPost.Content = updatePostBlog.Content;

            _blogContext.Entry(blogPost).State = EntityState.Modified;

            try
            {
                await _blogContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BlogPostExists(id))
                {
                    return NotFound("Blog post not found during update.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private bool BlogPostExists(Guid blogId) 
        {
            return _blogContext.BlogPosts.Any(b => b.Id == blogId);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBlogPost(Guid postId)
        {
            var user = await _userManager.GetUserAsync(User);
            var blogPost = await _blogContext.BlogPosts.FindAsync(postId);

            if(blogPost == null) { return NotFound(); }

            if (blogPost.IdUser != user.Id) { return Forbid(); }

            _blogContext.BlogPosts.Remove(blogPost);
            await _blogContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
