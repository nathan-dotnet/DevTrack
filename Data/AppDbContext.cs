using DevTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DevTrack.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Project => Set<Project>();
    public DbSet<TaskItem> Task => Set<TaskItem>();
    public DbSet<TimeLog> TimeLogs => Set<TimeLog>();
    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating (ModelBuilder modelBuilder)
    {
        // Unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Project -> Owner (no cascade delete)
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Owner)
            .WithMany(u => u.OwnedProjects)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Task -> Assignee (no cascade delete)
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.Assignee)
            .WithMany(u => u.AssignedTasks)
            .HasForeignKey(t => t.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);

        // Task ↔ Tag (many-to-many, EF auto join table)
        modelBuilder.Entity<TaskItem>()
            .HasMany(t => t.Tags)
            .WithMany(t => t.Tasks);
    }
}

