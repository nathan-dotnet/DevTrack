namespace DevTrack.API.DTOs.TimeLogs;

public class TimeLogResponse
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }
    public string? Notes { get; set; }
    public double? DurationMinutes { get; set; }
    public bool IsRunning => EndedAt is null;
}