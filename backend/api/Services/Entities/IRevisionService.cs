using api.Dtos;
using api.Models;

namespace api.Services;

public interface IRevisionService
{
    Task<ProjectWithAssetsDto> GetRevision(Guid projectId);
    Task<ProjectWithAssetsDto> CreateRevision(Guid projectId, CreateRevisionDto createRevisionDto);
    Task<ProjectDto> UpdateRevision(Guid projectId, Guid revisionId, UpdateRevisionDto updateRevisionDto);

}
