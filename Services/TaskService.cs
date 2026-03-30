using System.Net.Http.Headers;
using DevTrack.API.DTOs;
using DevTrack.API.DTOs.Tasks;
using DevTrack.API.Models;
using DevTrack.API.Repositories.Interfaces;
using DevTrack.API.Services.Interfaces;

namespace DevTrack.API.Services;

public class TaskService(ITaskRepository taskRepo) : ITaskService
{
    public async Task<PagedResult<TaskResponse>> GetTasksAsync(Guid projectId, TaskQueryParams query)
    {
        var (items, total) = await taskRepo.GetByProjectAsync(projectId, query);

        return new PagedResult<TaskResponse>
        {
            Items = items.Select(MapToResponse).ToList(),
            TotalCount = total,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<TaskResponse> GetTaskAsync(Guid id)
    {
        var task = await taskRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task {id} not found.");
        return MapToResponse(task);
    }

    public async Task<TaskResponse> CreateTaskAsync(Guid projectId, CreateTaskRequest request)
    {
        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            DueDate = request.DueDate,
            AssigneeId = request.AssigneeId,
            ProjectId = projectId
        };

        var created = await taskRepo.CreateAsync(task, request.Tags);
        return MapToResponse(created);
    }
    
    public async Task<TaskResponse> UpdateTaskAsync(Guid id UpdateTaskRequest request)
    {
        var task = await taskRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task {id} not found.");

        if (request.Title is not null)          task.Title = request.Title;
        if (request.Description is not null)    task.Description = request.Description;
        if (request.Status is not null)         task.Status = request.Status;
        if (request.Priority is not null)       task.Priority = request.Priority;
        if (request.DueDate.HasValue)           task.DueDate = request.DueDate;
        if (request.AssigneeId.HasValue)        task.AssigneeId = request.AssigneeId;

        var updates = await taskRepo.UpdateAsync(task, request.Tags);
        return MapToResponse(updated);
    }

    public async Task DeleteTaskAsync(Guid id)
    {
        var task = await taskRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task {id} not found.");
        await taskRepo.DeleteAsync(task);
    }

    private static TaskResponse MapToResponse(TaskItem t) => new ()
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        Status = t.Status,
        Priority = t.Priority,
        DueDate = t.DueDate,
        CreatedAt = t.CreatedAt,
        ProjectId = t.ProjectId,
        AssigneeId = t.AssigneeId,
        AssigneeEmail = t.Assignee?.Email,
        Tags = t.Tags.Select(tag => tag.Name).ToList()
    };
}
