namespace DevTrack.API.DTOs.Projects;

public class ProjectResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid OwnerId { get; set; }
    public string OwnerEmail { get; set; } = string.Empty;
    public int TaskCount { get; set; }
}