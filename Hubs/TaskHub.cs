using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DevTrack.API.Hubs;

[Authorize]
public class TaskHub : Hub
{
    //Client calls this to join a project's real-time group
    public async Task JoinProject(string projectId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"project-{projectId}");
    }

    // Client calls this when leaving a project view
    public async Task LeaveProject(string projectId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"project-{projectId}");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // SignalR automatically removes the connection from all groups on disconnect
        await base.OnDisconnectedAsync(exception);
    }
}