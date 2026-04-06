using System.Security.Claims;
using DevTrack.API.DTOs.TimeLogs;
using DevTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class TimeLogsController(ITimeLogService timeLogService) : ControllerBase
{
    // GET active timer for the current user
    [HttpGet("timers/active")]
    public async Task<IActionResult> GetActive()
    {
        var result = await timeLogService.GetActiveTimerAsync(GetUserId());
        return result is null ? NoContent() : Ok(result);
    }

    // POST start a timer on a task
    [HttpPost("tasks/{taskId:guid}/timers/start")]
    public async Task<IActionResult> Start(Guid taskId, StartTimerRequest request)
    {
        try
        {
            var result = await timeLogService.StartTimerAsync(taskId, GetUserId(), request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // POST stop the active timer
    [HttpPost("timers/stop")]
    public async Task<IActionResult> Stop(StopTimerRequest request)
    {
        try
        {
            var result = await timeLogService.StopTimerAsync(GetUserId(), request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET all time logs for a task
    [HttpGet("tasks/{taskId:guid}/timelogs")]
    public async Task<IActionResult> GetByTask(Guid taskId)
    {
        var logs = await timeLogService.GetByTaskAsync(taskId);
        return Ok(logs);
    }

    // POST manual time entry on a task
    [HttpPost("tasks/{taskId:guid}/timelogs")]
    public async Task<IActionResult> LogManual(Guid taskId, ManualTimeLogRequest request)
    {
        try
        {
            var result = await timeLogService.LogManualAsync(taskId, GetUserId(), request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE a time log
    [HttpDelete("timelogs/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await timeLogService.DeleteAsync(id, GetUserId());
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}