using System.Reflection.Metadata.Ecma335;
using DevTrack.API.Data;
using DevTrack.API.DTOs.Tasks;
using DevTrack.API.Models;
using DevTrack.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DevTrack.API.Repositories;

public class TaskRepository(AppDbContext db) : ITaskRepository
{
    public async Task<(List<TaskItem> Items, int TotalCount)> GetByProjectAsync(
        Guid projectId, TaskQueryParams query)
    {
        var q = db.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.Tags)
            .Where(t => t.ProjectId == projectId);
            
        if (!string.IsNullOrEmpty(query.Status))
            q = q.Where(t => t.Status == query.Status);
        
        if (!string.IsNullOrEmpty(query.Priority))
            q = q.Where(t => t.Priority == query.Status);

        if (query.AssigneeId.HasValue)
            q = q.Where(t => t.AssigneeId == query.AssigneeId);
        
        q = query.SortBy switch
        {
            "DueDate"  => query.Descending ? q.OrderByDescending (t => t.DueDate) : q.OrderBy(t => t.DueDate),
            "Priority" => query.Descending ? q.OrderByDescending (t => t.Priority) : q.OrderBy(t => t.Priority),
            _          => query.Descending ? q.OrderByDescending (t => t.CreatedAt) : q.OrderBy(t => t.CreatedAt)
        };

        var total = await q.CountAsync();
        var items = await q
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();
        
        return (items, total);
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id) =>
        await db.Tasks
            .Include(t => t.Assignee)
            .Include(t => t.Tags)
            .FirstOrDefaultAsync(t => t.Id == id);
    
    public async Task<TaskItem> CreateAsync(TaskItem task, List<string> tagNames)
    {
        task.Tags = await ResolveTagsAsync(tagNames);
        db.Tasks.Add(task);
        await db.SaveChangesAsync();
        return task;
    }
    public async Task<TaskItem> UpdateAsync(TaskItem task, List<string>? tagNames)
    {
        if (tagNames is not null)
            task.Tags = await ResolveTagsAsync(tagNames);

        await db.SaveChangesAsync();
        return task;
    }

    public async Task DeleteAsync(TaskItem task)
    {
        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
    }

    // Reuse existing tags or create new ones - avoids duplicate tags rows
    private async Task<List<Tag>> ResolveTagsAsync(List<string> names)
    {
        var normalized = names
            .Select(n => n.Trim().ToLower())
            .Distinct()
            .ToList();
        
        var existing = await db.Tags
            .Where(t => normalized.Contains(t.Name))
            .ToListAsync();

        var existingNames = existing.Select(t => t.Name).ToHashSet();

        var newTags = normalized
            .Where(n => !existingNames.Contains(n))
            .Select(n => new Tag { Name = n })
            .ToList();
        
        if (newTags.Count > 0)
        {
            db.Tags.AddRange(newTags);
            await db.SaveChangesAsync();
        }

        return [..existing, ..newTags];
    }
}