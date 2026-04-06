using System.ComponentModel.DataAnnotations;

namespace DevTrack.API.DTOs.TimeLogs;
public class ManualTimeLogRequest
{
    [Required]
    public DateTime StartedAt { get; set; }

    [Required]
    public DateTime EndedAt { get; set; }
    public string? Notes { get; set; }
}