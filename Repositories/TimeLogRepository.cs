using DevTrack.API.Data;
using DevTrack.API.Models;
using DevTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DevTrack.API.Repositories;

public class TimeLogRepository(AppDbContext db) : ITimeLogRepository
{
    public async Task<TimeLog?> GetActiveTimerAsync(Guid userId) =>
        await db.TimeLogs
            .Include(t => t.Task)
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.UserId == userId && t.EndedAt == null);

    public async Task<TimeLog?> GetByIdAsync(Guid id) =>
        await db.TimeLogs
            .Include(t => t.Task)
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id);
    
    public async Task<List<TimeLog>> GetByTaskAsync(Guid taskId) =>
        await db.TimeLogs
            .Include(t => t.Task)
            .Include(t => t.User)
            .Where(t => t.TaskId == taskId)
            .OrderByDescending(t => t.StartedAt)
            .ToListAsync();
    
    public async Task<List<TimeLog>> GetByUserAsync(Guid userId) =>
        await db.TimeLogs
            .Include(t => t.Task)
            .Include(t => t.User)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.StartedAt)
            .ToListAsync();
    
    public async Task<TimeLog> CreateAsync(TimeLog timeLog)
    {
        db.TimeLogs.Add(timeLog);
        await db.SaveChangesAsync();
        return timeLog;
    }   

    public async Task<TimeLog> UpdateAsync(TimeLog timeLog)
    {
        await db.SaveChangesAsync();
        return timeLog;
    }

    public async Task DeleteAsync(TimeLog timeLog)
    {
        db.TimeLogs.Remove(timeLog);
        await db.SaveChangesAsync();
    }
}