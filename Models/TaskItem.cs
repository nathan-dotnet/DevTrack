using Microsoft.AspNetCore.Connections;

namespace DevTrack.API.Models;

public class TaskItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } 
    public string Status { get; set; } = "Todo"; //Todo, Inprogress, Done
    public string Priority { get; set; } = "Meduim"; // Low, Meduim, High
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public Guid? AssigneeId { get; set; }
    public User? Assignee { get; set; }
    public ICollection<TimeLog> TimeLogs { get; set; } = [];
    public ICollection<Tag> Tags { get; set; } = [];

}