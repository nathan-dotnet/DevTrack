using System.ComponentModel.DataAnnotations;

namespace DevTrack.API.DTOs.Projects;

public class CreateProjectRequest
{
    [Required, MinLength(1)]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}