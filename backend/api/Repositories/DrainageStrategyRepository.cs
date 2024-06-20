using System.Linq.Expressions;

using api.Context;
using api.Enums;
using api.Models;

using Microsoft.EntityFrameworkCore;


namespace api.Repositories;

public class DrainageStrategyRepository : BaseRepository, IDrainageStrategyRepository
{

    public DrainageStrategyRepository(DcdDbContext context) : base(context)
    {
    }

    public async Task<DrainageStrategy?> GetDrainageStrategy(Guid drainageStrategyId)
    {
        return await Get<DrainageStrategy>(drainageStrategyId);
    }

    public async Task<bool> DrainageStrategyHasProfile(Guid drainageStrategyId, DrainageStrategyProfileNames profileType)
    {
        Expression<Func<DrainageStrategy, bool>> profileExistsExpression = profileType switch
        {
            DrainageStrategyProfileNames.ProductionProfileOil => d => d.ProductionProfileOil != null,
            DrainageStrategyProfileNames.ProductionProfileGas => d => d.ProductionProfileGas != null,
            DrainageStrategyProfileNames.ProductionProfileWater => d => d.ProductionProfileWater != null,
            DrainageStrategyProfileNames.ProductionProfileWaterInjection => d => d.ProductionProfileWaterInjection != null,
            DrainageStrategyProfileNames.FuelFlaringAndLossesOverride => d => d.FuelFlaringAndLossesOverride != null,
            DrainageStrategyProfileNames.NetSalesGasOverride => d => d.NetSalesGasOverride != null,
            DrainageStrategyProfileNames.Co2EmissionsOverride => d => d.Co2EmissionsOverride != null,
            DrainageStrategyProfileNames.ImportedElectricityOverride => d => d.ImportedElectricityOverride != null,
            DrainageStrategyProfileNames.DeferredOilProduction => d => d.DeferredOilProduction != null,
            DrainageStrategyProfileNames.DeferredGasProduction => d => d.DeferredGasProduction != null,
        };

        bool hasProfile = await _context.DrainageStrategies
            .Where(d => d.Id == drainageStrategyId)
            .AnyAsync(profileExistsExpression);

        return hasProfile;
    }

    public DrainageStrategy UpdateDrainageStrategy(DrainageStrategy drainageStrategy)
    {
        return Update(drainageStrategy);
    }

    public ProductionProfileOil CreateProductionProfileOil(ProductionProfileOil productionProfileOil)
    {
        _context.ProductionProfileOil.Add(productionProfileOil);
        return productionProfileOil;
    }

    public async Task<ProductionProfileOil?> GetProductionProfileOil(Guid productionProfileOilId)
    {
        return await Get<ProductionProfileOil>(productionProfileOilId);
    }

    public ProductionProfileOil UpdateProductionProfileOil(ProductionProfileOil productionProfileOil)
    {
        return Update(productionProfileOil);
    }

    public ProductionProfileGas CreateProductionProfileGas(ProductionProfileGas profile)
    {
        _context.ProductionProfileGas.Add(profile);
        return profile;
    }

    public async Task<ProductionProfileGas?> GetProductionProfileGas(Guid productionProfileId)
    {
        return await Get<ProductionProfileGas>(productionProfileId);
    }

    public ProductionProfileGas UpdateProductionProfileGas(ProductionProfileGas productionProfile)
    {
        return Update(productionProfile);
    }

    public ProductionProfileWater CreateProductionProfileWater(ProductionProfileWater profile)
    {
        _context.ProductionProfileWater.Add(profile);
        return profile;
    }

    public async Task<ProductionProfileWater?> GetProductionProfileWater(Guid productionProfileId)
    {
        return await Get<ProductionProfileWater>(productionProfileId);
    }

    public ProductionProfileWater UpdateProductionProfileWater(ProductionProfileWater productionProfile)
    {
        return Update(productionProfile);
    }

    public ProductionProfileWaterInjection CreateProductionProfileWaterInjection(ProductionProfileWaterInjection profile)
    {
        _context.ProductionProfileWaterInjection.Add(profile);
        return profile;
    }
    public async Task<ProductionProfileWaterInjection?> GetProductionProfileWaterInjection(Guid productionProfileId)
    {
        return await Get<ProductionProfileWaterInjection>(productionProfileId);
    }


    public ProductionProfileWaterInjection UpdateProductionProfileWaterInjection(ProductionProfileWaterInjection productionProfile)
    {
        return Update(productionProfile);
    }

    public FuelFlaringAndLossesOverride CreateFuelFlaringAndLossesOverride(FuelFlaringAndLossesOverride profile)
    {
        _context.FuelFlaringAndLossesOverride.Add(profile);
        return profile;
    }

    public async Task<FuelFlaringAndLossesOverride?> GetFuelFlaringAndLossesOverride(Guid profileId)
    {
        return await Get<FuelFlaringAndLossesOverride>(profileId);
    }


    public FuelFlaringAndLossesOverride UpdateFuelFlaringAndLossesOverride(FuelFlaringAndLossesOverride profile)
    {
        return Update(profile);
    }

    public NetSalesGasOverride CreateNetSalesGasOverride(NetSalesGasOverride profile)
    {
        _context.NetSalesGasOverride.Add(profile);
        return profile;
    }

    public async Task<NetSalesGasOverride?> GetNetSalesGasOverride(Guid profileId)
    {
        return await Get<NetSalesGasOverride>(profileId);
    }


    public NetSalesGasOverride UpdateNetSalesGasOverride(NetSalesGasOverride profile)
    {
        return Update(profile);
    }

    public Co2EmissionsOverride CreateCo2EmissionsOverride(Co2EmissionsOverride profile)
    {
        _context.Co2EmissionsOverride.Add(profile);
        return profile;
    }

    public async Task<Co2EmissionsOverride?> GetCo2EmissionsOverride(Guid profileId)
    {
        return await Get<Co2EmissionsOverride>(profileId);
    }


    public Co2EmissionsOverride UpdateCo2EmissionsOverride(Co2EmissionsOverride profile)
    {
        return Update(profile);
    }

    public ImportedElectricityOverride CreateImportedElectricityOverride(ImportedElectricityOverride profile)
    {
        _context.ImportedElectricityOverride.Add(profile);
        return profile;
    }

    public async Task<ImportedElectricityOverride?> GetImportedElectricityOverride(Guid profileId)
    {
        return await Get<ImportedElectricityOverride>(profileId);
    }


    public ImportedElectricityOverride UpdateImportedElectricityOverride(ImportedElectricityOverride profile)
    {
        return Update(profile);
    }

    public DeferredOilProduction CreateDeferredOilProduction(DeferredOilProduction profile)
    {
        _context.DeferredOilProduction.Add(profile);
        return profile;
    }

    public async Task<DeferredOilProduction?> GetDeferredOilProduction(Guid productionProfileId)
    {
        return await Get<DeferredOilProduction>(productionProfileId);
    }


    public DeferredOilProduction UpdateDeferredOilProduction(DeferredOilProduction productionProfile)
    {
        return Update(productionProfile);
    }

    public DeferredGasProduction CreateDeferredGasProduction(DeferredGasProduction profile)
    {
        _context.DeferredGasProduction.Add(profile);
        return profile;
    }

    public async Task<DeferredGasProduction?> GetDeferredGasProduction(Guid productionProfileId)
    {
        return await Get<DeferredGasProduction>(productionProfileId);
    }


    public DeferredGasProduction UpdateDeferredGasProduction(DeferredGasProduction productionProfile)
    {
        return Update(productionProfile);
    }
}
