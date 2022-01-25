
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{

    public class DrainageStrategy
    {
        public Guid Id { get; set; }
        [ForeignKey("Project.Id")]
        public virtual Project Project { get; set; } = null!;
        public string Name { get; set; } = null!;
        public double NGLYield { get; set; }
        public virtual ProductionProfileOil ProductionProfileOil { get; set; } = null!;
        public virtual ProductionProfileGas ProductionProfileGas { get; set; } = null!;
        public virtual ProductionProfileWater ProductionProfileWater { get; set; } = null!;
        public virtual ProductionProfileWaterInjection ProductionProfileWaterInjection { get; set; } = null!;
        public virtual FuelFlaringAndLosses FuelFlaringAndLosses { get; set; } = null!;
        public virtual NetSalesGas NetSalesGas { get; set; } = null!;
        public virtual Co2Emissions Co2Emissions { get; set; } = null!;
    }
    public class ProductionProfileOil : TimeSeriesVolume<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }

    public class ProductionProfileGas : TimeSeriesVolume<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }
    public class ProductionProfileWater : TimeSeriesVolume<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }
    public class ProductionProfileWaterInjection : TimeSeriesVolume<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }
    public class FuelFlaringAndLosses : TimeSeriesVolume<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }
    public class NetSalesGas : TimeSeriesVolume<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }
    public class Co2Emissions : TimeSeriesMass<double>
    {
        [ForeignKey("DrainageStrategy.Id")]
        public virtual DrainageStrategy DrainageStrategy { get; set; } = null!;
    }
}