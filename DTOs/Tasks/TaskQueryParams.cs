namespace DevTrack.API.DTOs.Tasks;

public class TaskQueryParams
{
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public Guid? AssigneeId { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public bool Descending { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}