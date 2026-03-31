using DevTrack.API.DTOs.Projects;
using DevTrack.API.Models;
using DevTrack.API.Repositories.Interfaces;
using DevTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DevTrack.API.Services;

public class ProjectService(IProjectRepository projectRepo) : IProjectService
{
    public async Task<List<ProjectResponse>> GetMyProjectsAsync(Guid userId)
    {
        var projects = await projectRepo.GetByOwnerAsync(userId);
        return projects.Select(MapToResponse).ToList();
    }

    public async Task<ProjectResponse> GetProjectAsync(Guid id, Guid userId)
    {
        var project = await projectRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Project {id} not found.");

        EnsureOwner(project, userId);
        return MapToResponse(project);
    }

    public async Task<ProjectResponse> CreateProjectAsync(Guid userId, CreateProjectRequest request)
    {
        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = userId
        };

        var created = await projectRepo.CreateAsync(project);
        return MapToResponse(created);
    }

    public async Task<ProjectResponse> UpdateProjectAsync(Guid id, Guid userId, UpdateProjectRequest request)
    {
        var project = await projectRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Project {id} not found.");

        EnsureOwner(project, userId);

        if (request.Name is not null)           project.Name = request.Name;
        if (request.Description is not null)    project.Description = request.Description;

        var updated = await projectRepo.UpdateAsync(project);
        return MapToResponse(updated);
    }

    public async Task DeleteProjectAsync(Guid id, Guid userId)
    {
        var project = await projectRepo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Project {id} not found.");

        EnsureOwner(project, userId);
        await projectRepo.DeleteAsync(project);
    }

    // Only the owner can modify their project
    private static void EnsureOwner(Project project, Guid userId)
    {
        if (project.OwnerId != userId)
            throw new UnauthorizedAccessException("You don't have access to this project.");
    }

    private static ProjectResponse MapToResponse(Project p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        CreatedAt = p.CreatedAt,
        OwnerId = p.OwnerId,
        OwnerEmail = p.Owner?.Email ?? string.Empty,
        TaskCount = p.Tasks?.Count ?? 0
    };
}