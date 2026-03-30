using DevTrack.API.DTOs.Tasks;
using DevTrack.API.Models;

namespace DevTrack.API.Repositories.Interfaces;

public interface ITaskRepository
{
    Task<(List<TaskItem> Items, int TotalCount)> GetByProjectAsync(Guid projectId, TaskQueryParams query);
    Task<TaskItem?> GetByIdAsync(Guid id);
    Task<TaskItem> CreateAsync(TaskItem task, List<string> tagNames);
    Task<TaskItem> UpdateAsync(TaskItem task, List<string>? tagNames);
    Task DeleteAsync(TaskItem task);
}