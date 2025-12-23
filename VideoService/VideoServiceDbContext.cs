using System.Collections.Generic;
using VideoService.Models;
using Microsoft.EntityFrameworkCore;

namespace VideoService
{
    public class VideoServiceDbContext : DbContext
    {
        public VideoServiceDbContext(DbContextOptions<VideoServiceDbContext> options)
            : base(options) { }

        public DbSet<VideoMapping> VideoMappings { get; set; } = default!;
    }

}
