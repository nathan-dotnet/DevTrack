namespace DevTrack.API.Models;

public class Tag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    public ICollection<TaskItem> Tasks { get; set; } = [];
}