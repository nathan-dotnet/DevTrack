using DevTrack.API.DTOs;
using DevTrack.API.DTOs.Tasks;

namespace DevTrack.API.Services.Interfaces;

public interface ITaskService
{
    Task<PagedResult<TaskResponse>> GetTasksAsync(Guid projectId, TaskQueryParams query);
    Task<TaskResponse> GetTaskAsync(Guid id);
    Task<TaskResponse> CreateTaskAsync(Guid project, CreateTaskRequest request);
    Task<TaskResponse> UpdateTaskAsync(Guid id, UpdateTaskRequest request);
    Task DeleteTaskAsync(Guid id);
}