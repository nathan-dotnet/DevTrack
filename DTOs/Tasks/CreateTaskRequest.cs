using System.ComponentModel.DataAnnotations;

namespace DevTrack.API.DTOs.Tasks;

public class CreateTaskRequest
{
    [Required, MinLength(1)]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "Medium";
    public DateTime? DueDate { get; set; } 
    public Guid? AssigneeId { get; set; }
    public List<string> Tags { get; set; } = [];
}