using DevTrack.API.DTOs.TimeLogs;
using DevTrack.API.Models;
using DevTrack.API.Repositories.Interfaces;
using DevTrack.API.Services.Interfaces;

namespace DevTrack.API.Services;

public class TimeLogService(ITimeLogRepository timeLogRepo) : ITimeLogService
{
    public async Task<TimeLogResponse> StartTimerAsync(Guid taskId, Guid userId, StartTimerRequest request)
    {
        // Stop any running timer first — only one active timer per user
        var active = await timeLogRepo.GetActiveTimerAsync(userId);
        if (active is not null)
        {
            active.EndedAt = DateTime.UtcNow;
            await timeLogRepo.UpdateAsync(active);
        }

        var timeLog = new TimeLog
        {
            TaskId = taskId,
            UserId = userId,
            StartedAt = DateTime.UtcNow,
            Notes = request.Notes
        };

        var created = await timeLogRepo.CreateAsync(timeLog);
        return MapToResponse(created);
    }

    public async Task<TimeLogResponse> StopTimerAsync(Guid userId, StopTimerRequest request)
    {
        var active = await timeLogRepo.GetActiveTimerAsync(userId)
            ?? throw new InvalidOperationException("No active timer found.");

        active.EndedAt = DateTime.UtcNow;
        if (request.Notes is not null) active.Notes = request.Notes;

        var updated = await timeLogRepo.UpdateAsync(active);
        return MapToResponse(updated);
    }

    public async Task<TimeLogResponse?> GetActiveTimerAsync(Guid userId)
    {
        var active = await timeLogRepo.GetActiveTimerAsync(userId);
        return active is null ? null : MapToResponse(active);
    }

    public async Task<List<TimeLogResponse>> GetByTaskAsync(Guid taskId)
    {
        var logs = await timeLogRepo.GetByTaskAsync(taskId);
        return logs.Select(MapToResponse).ToList();
    }

    public async Task<TimeLogResponse> LogManualAsync(Guid taskId, Guid userId, ManualTimeLogRequest request)
    {
        if (request.EndedAt <= request.StartedAt)
            throw new ArgumentException("End time must be after start time.");

        var timeLog = new TimeLog
        {
            TaskId = taskId,
            UserId = userId,
            StartedAt = request.StartedAt,
            EndedAt = request.EndedAt,
            Notes = request.Notes
        };

        var created = await timeLogRepo.CreateAsync(timeLog);
        return MapToResponse(created);
    }

    public async Task DeleteAsync(Guid timeLogId, Guid userId)
    {
        var log = await timeLogRepo.GetByIdAsync(timeLogId)
            ?? throw new KeyNotFoundException("Time log not found.");

        if (log.UserId != userId)
            throw new UnauthorizedAccessException("You can only delete your own time logs.");

        await timeLogRepo.DeleteAsync(log);
    }

    private static TimeLogResponse MapToResponse(TimeLog t) => new()
    {
        Id = t.Id,
        TaskId = t.TaskId,
        TaskTitle = t.Task?.Title ?? string.Empty,
        UserId = t.UserId,
        UserEmail = t.User?.Email ?? string.Empty,
        StartedAt = t.StartedAt,
        EndedAt = t.EndedAt,
        Notes = t.Notes,
        DurationMinutes = t.EndedAt.HasValue
            ? (t.EndedAt.Value - t.StartedAt).TotalMinutes
            : null
    };
}