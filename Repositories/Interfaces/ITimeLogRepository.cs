using DevTrack.API.Models;

namespace DevTrack.API.Repositories.Interfaces;

public interface ITimeLogRepository
{
    Task<TimeLog?> GetActiveTimerAsync(Guid userId);
    Task<TimeLog?> GetByIdAsync(Guid id);
    Task<List<TimeLog>> GetByTaskAsync(Guid taskId);
    Task<List<TimeLog>> GetByUserAsync(Guid userId);
    Task<TimeLog> CreateAsync(TimeLog timeLog);
    Task<TimeLog> UpdateAsync(TimeLog timeLog);
    Task DeleteAsync(TimeLog timeLog);
}