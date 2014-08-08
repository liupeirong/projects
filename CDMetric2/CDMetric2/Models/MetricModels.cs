using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace CDMetric2.Models
{
    [Table("RolloutStageDuration")]
    public class RolloutDetails
    {
        [Key, Column(Order = 0)]
        public int ChangeNumber { get; set; }
        public string RolloutName { get; set; }
        [Key, Column(Order = 1)]
        public string StageName { get; set; }
        public int DurationInMin { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

    [Table("StageRolloutSummary")]
    public class RolloutSummary
    {
        [Key, Column(Order = 0)]
        public int ChangeNumber { get; set; }
        public string RolloutName { get; set; }
        public int DurationInMin { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public virtual ICollection<RolloutDetails> Stages { get; set; }
    }

}