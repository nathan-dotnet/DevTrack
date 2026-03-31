using DevTrack.API.DTOs.Projects;

namespace DevTrack.API.Services.Interfaces;

public interface IProjectService
{
    Task<List<ProjectResponse>> GetMyProjectsAsync(Guid userId);
    Task<ProjectResponse> GetProjectAsync(Guid id, Guid userId);
    Task<ProjectResponse> CreateProjectAsync(Guid userId, CreateProjectRequest request);
    Task<ProjectResponse> UpdateProjectAsync(Guid id, Guid userId, UpdateProjectRequest request);
    Task DeleteProjectAsync(Guid id, Guid userId);
}