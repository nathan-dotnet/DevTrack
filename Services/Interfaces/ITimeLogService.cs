using DevTrack.API.DTOs.TimeLogs;

namespace DevTrack.API.Services.Interfaces;

public interface ITimeLogService
{
    Task<TimeLogResponse> StartTimerAsync(Guid taskId, Guid userId, StartTimerRequest request);
    Task<TimeLogResponse> StopTimerAsync(Guid userId, StopTimerRequest request);
    Task<TimeLogResponse?> GetActiveTimerAsync(Guid userId);
    Task<List<TimeLogResponse>> GetByTaskAsync(Guid taskId);
    Task<TimeLogResponse> LogManualAsync(Guid taskId, Guid userId, ManualTimeLogRequest request);
    Task DeleteAsync(Guid timeLogId, Guid userId);
}