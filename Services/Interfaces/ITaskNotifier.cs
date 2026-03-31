using DevTrack.API.DTOs.Tasks;

namespace DevTrack.API.Services.Interfaces;

public interface ITaskNotifier
{
    Task TaskCreated(Guid projectId, TaskResponse task);
    Task TaskUpdated(Guid projectId, TaskResponse task);
    Task TaskDeleted(Guid projectId, Guid taskId);   
}