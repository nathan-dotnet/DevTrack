using DevTrack.API.Data;
using DevTrack.API.DTOs.Reports;
using DevTrack.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DevTrack.API.Services;

public class ReportService(AppDbContext db) : IReportService
{
    public async Task<ProjectReportResponse> GetProjectReportAsync(Guid projectId, Guid userId)
    {
        var project = await db.Projects
            .Include(p => p.Tasks)
                .ThenInclude(t => t.TimeLogs)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.OwnerId == userId)
            ?? throw new KeyNotFoundException("Project not found.");

        var tasks = project.Tasks.ToList();

        // Per-task time breakdown
        var taskBreakdowns = tasks.Select(t => new TaskTimeBreakdown
        {
            TaskId = t.Id,
            TaskTitle = t.Title,
            Status = t.Status,
            HoursLogged = t.TimeLogs
                .Where(l => l.EndedAt.HasValue)
                .Sum(l => (l.EndedAt!.Value - l.StartedAt).TotalHours)
        })
        .OrderByDescending(t => t.HoursLogged)
        .ToList();

        // Daily activity for the last 14 days
        var since = DateTime.UtcNow.AddDays(-14).Date;

        var dailyActivity = Enumerable.Range(0, 14)
            .Select(i => since.AddDays(i))
            .Select(date => new DailyActivity
            {
                Date = date.ToString("yyyy-MM-dd"),
                TasksCompleted = tasks.Count(t =>
                    t.Status == "Done" &&
                    t.TimeLogs.Any(l =>
                        l.EndedAt.HasValue &&
                        l.EndedAt.Value.Date == date)),
                HoursLogged = tasks
                    .SelectMany(t => t.TimeLogs)
                    .Where(l => l.EndedAt.HasValue && l.StartedAt.Date == date)
                    .Sum(l => (l.EndedAt!.Value - l.StartedAt).TotalHours)
            })
            .ToList();

        var totalHours = taskBreakdowns.Sum(t => t.HoursLogged);

        return new ProjectReportResponse
        {
            ProjectId = project.Id,
            ProjectName = project.Name,
            TotalTasks = tasks.Count,
            TodoCount = tasks.Count(t => t.Status == "Todo"),
            InProgressCount = tasks.Count(t => t.Status == "InProgress"),
            DoneCount = tasks.Count(t => t.Status == "Done"),
            TotalHoursLogged = Math.Round(totalHours, 2),
            TaskBreakdowns = taskBreakdowns,
            DailyActivity = dailyActivity
        };
    }
}