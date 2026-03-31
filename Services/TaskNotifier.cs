using DevTrack.API.DTOs.Tasks;
using DevTrack.API.Hubs;
using DevTrack.API.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace DevTrack.API.Services;

public class TaskNotifier(IHubContext<TaskHub> hubContext) : ITaskNotifier
{
    public async Task TaskCreated(Guid projectId, TaskResponse task) =>
        await hubContext.Clients
            .Group($"project-{projectId}")
            .SendAsync("TaskCreated", task);

    public async Task TaskUpdated(Guid projectId, TaskResponse task) =>
        await hubContext.Clients
            .Group($"project-{projectId}")
            .SendAsync("TaskUpdated", task);

    public async Task TaskDeleted(Guid projectId, Guid TaskId) =>
        await hubContext.Clients
            .Group($"project-{projectId}")
            .SendAsync("TaskDeleted", TaskId);
}