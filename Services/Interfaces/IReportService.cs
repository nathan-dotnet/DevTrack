using DevTrack.API.DTOs.Reports;
using DevTrack.API.Models;

namespace DevTrack.API.Services.Interfaces;

public interface IReportService
{
    Task<ProjectReportResponse> GetProjectReportAsync(Guid projectId, Guid userId);
}