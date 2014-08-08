using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CDMetric2.Models
{
    public class MetricContext : DbContext
    {
        public MetricContext(): base("name=MetricDB")
        {
            Database.SetInitializer<MetricContext>(null);
        }

        public DbSet<RolloutDetails> RolloutDetailsTable {get; set;}

        public System.Data.Entity.DbSet<CDMetric2.Models.RolloutSummary> RolloutSummaries { get; set; }
    }
}