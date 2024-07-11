using System.Linq.Expressions;

using api.Context;
using api.Enums;
using api.Models;

using Microsoft.EntityFrameworkCore;


namespace api.Repositories;

public class CaseRepository : BaseRepository, ICaseRepository
{
    private readonly ILogger<CaseRepository> _logger;

    public CaseRepository(
        DcdDbContext context,
        ILogger<CaseRepository> logger
        ) : base(context)
    {
        _logger = logger;
    }

    public async Task<Case?> GetCase(Guid caseId)
    {
        return await Get<Case>(caseId);
    }

    public async Task<bool> CaseHasProfile(Guid caseId, CaseProfileNames profileType)
    {
        Expression<Func<Case, bool>> profileExistsExpression = profileType switch
        {
            CaseProfileNames.CessationWellsCostOverride => d => d.CessationWellsCostOverride != null,
            CaseProfileNames.CessationOffshoreFacilitiesCostOverride => d => d.CessationOffshoreFacilitiesCostOverride != null,
            CaseProfileNames.CessationOnshoreFacilitiesCostProfile => d => d.CessationOnshoreFacilitiesCostProfile != null,
            CaseProfileNames.TotalFeasibilityAndConceptStudiesOverride => d => d.TotalFeasibilityAndConceptStudiesOverride != null,
            CaseProfileNames.TotalFEEDStudiesOverride => d => d.TotalFEEDStudiesOverride != null,
            CaseProfileNames.TotalOtherStudiesCostProfile => d => d.TotalOtherStudiesCostProfile != null,
            CaseProfileNames.HistoricCostCostProfile => d => d.HistoricCostCostProfile != null,
            CaseProfileNames.WellInterventionCostProfileOverride => d => d.WellInterventionCostProfileOverride != null,
            CaseProfileNames.OffshoreFacilitiesOperationsCostProfileOverride => d => d.OffshoreFacilitiesOperationsCostProfileOverride != null,
            CaseProfileNames.OnshoreRelatedOPEXCostProfile => d => d.OnshoreRelatedOPEXCostProfile != null,
            CaseProfileNames.AdditionalOPEXCostProfile => d => d.AdditionalOPEXCostProfile != null,
        };

        bool hasProfile = await _context.Cases
            .Where(d => d.Id == caseId)
            .AnyAsync(profileExistsExpression);

        return hasProfile;
    }

    public Case UpdateCase(Case updatedCase)
    {
        return Update(updatedCase);
    }

    public async Task UpdateModifyTime(Guid caseId)
    {
        if (caseId == Guid.Empty)
        {
            throw new ArgumentException("The case id cannot be empty.", nameof(caseId));
        }

        var caseItem = await _context.Cases.SingleOrDefaultAsync(c => c.Id == caseId)
            ?? throw new KeyNotFoundException($"Case with id {caseId} not found.");

        caseItem.ModifyTime = DateTimeOffset.UtcNow;

        var projectItem = await _context.Projects.SingleOrDefaultAsync(p => p.Id == caseItem.ProjectId)
            ?? throw new KeyNotFoundException($"Project with id {caseItem.ProjectId} not found.");

        projectItem.ModifyTime = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();


    }

}
