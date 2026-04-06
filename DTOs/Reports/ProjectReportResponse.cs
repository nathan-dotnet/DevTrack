namespace DevTrack.API.DTOs.Reports;

public class ProjectReportResponse
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public int TotalTasks { get; set; }
    public int TodoCount { get; set; }
    public int InProgressCount { get; set; }
    public int DoneCount { get; set; }
    public double TotalHoursLogged { get; set; }
    public List<TaskTimeBreakdown> TaskBreakdowns { get; set; } = [];
    public List<DailyActivity> DailyActivity { get; set; } = [];
}

public class TaskTimeBreakdown
{
    public Guid TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double HoursLogged { get; set; }
}

public class DailyActivity
{
    public string Date { get; set; } = string.Empty;
    public int TasksCompleted { get; set; }
    public double HoursLogged { get; set; }
}