using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CDMetric2.Models
{
    [Table("RolloutStageDuration")]
    public class Metric
    {
        [Key, Column(Order = 0)]
        public int ChangeNumber { get; set; }
        [Key, Column(Order = 1)]
        public string RolloutName { get; set; }
        [Key, Column(Order = 2)]
        public string MasterEnvironment { get; set; }
        [Key, Column(Order = 3)]
        public string StageName { get; set; }
    }

}