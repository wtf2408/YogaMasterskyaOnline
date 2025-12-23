using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CoursesService.Models;

namespace CoursesService.Data
{
    public class CourceServiceContext : DbContext
    {
        public CourceServiceContext (DbContextOptions<CourceServiceContext> options)
            : base(options)
        {
        }

        public DbSet<Course> Course { get; set; } = default!;
        public DbSet<Lesson> Lesson { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!; 

    }
}
