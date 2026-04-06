using System.Security.Claims;
using DevTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api/projects/{projectId:guid}/report")]
public class ReportsController(IReportService reportService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetReport(Guid projectId)
    {
        var userId = GetUserId();
        Console.WriteLine($"JWT userId: {userId}");
        
        try
        {
            var report = await reportService.GetProjectReportAsync(projectId, GetUserId());
            return Ok(report);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}