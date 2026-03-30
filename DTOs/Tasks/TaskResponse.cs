namespace DevTrack.API.DTOs.Tasks;

public class TaskResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssigneeId { get; set; }
    public string? AssigneeEmail { get; set; }
    public List<string> Tags { get; set; } = [];
}