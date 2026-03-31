using DevTrack.API.Data;
using DevTrack.API.Models;
using DevTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DevTrack.API.Repositories;

public class ProjectRepository(AppDbContext db) : IProjectRepository
{
    public async Task<List<Project>> GetByOwnerAsync(Guid ownerId) =>
        await db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Tasks)
            .Where(p => p.OwnerId == ownerId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    public async Task<Project?> GetByIdAsync (Guid id) =>
        await db.Projects
            .Include(p => p.Owner)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id);
    
    public async Task<Project> CreateAsync(Project project)
    {
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return project;
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        await db.SaveChangesAsync();
        return project;
    }

    public async Task DeleteAsync(Project project)
    {
        db.Projects.Remove(project);
        await db.SaveChangesAsync();
    }
}