using DevTrack.API.Models;

namespace DevTrack.API.Repositories.Interfaces;

public interface IProjectRepository
{
    Task<List<Project>> GetByOwnerAsync(Guid ownerId);
    Task<Project?> GetByIdAsync(Guid id);
    Task<Project> CreateAsync(Project project);
    Task<Project> UpdateAsync(Project project);
    Task DeleteAsync(Project project);
}