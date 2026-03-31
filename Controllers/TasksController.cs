using System.Security.Claims;
using DevTrack.API.DTOs.Tasks;
using DevTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevTrack.API.Controllers;

[ApiController]
[Authorize]
[Route("api/projects/{projectId:guid}/task")]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid projectId, [FromQuery] TaskQueryParams query)
    {
        var result = await taskService.GetTasksAsync(projectId, query);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid projectId, Guid id)
    {
        try
        {
            var task = await taskService.GetTaskAsync(id);
            return Ok(task);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
    [HttpPost]
    public async Task<IActionResult> Create(Guid projectId, CreateTaskRequest request)
    {
        var task = await taskService.CreateTaskAsync(projectId, request);
        return CreatedAtAction(nameof(GetById), new { projectId, id = task.Id }, task);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(Guid projectId, Guid id, UpdateTaskRequest request)
    {
        try
        {
            var task = await taskService.UpdateTaskAsync(id, request);
            return Ok(task);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid projectId, Guid id)
    {
        try
        {
            await taskService.DeleteTaskAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

}