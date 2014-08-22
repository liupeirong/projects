using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using CDMetric2.Models;

namespace CDMetric2.Controllers
{
    public class RolloutDetailsController : ApiController
    {
        private MetricContext db = new MetricContext();

        public IQueryable<RolloutDetails> GetRolloutDetails()
        {
            IQueryable<RolloutDetails> query =
                from metric in db.RolloutDetailsTable.Distinct()
                orderby metric.ChangeNumber, metric.StartTime ascending, metric.StageName
                select metric;
                //group metric by new RolloutDetails { ChangeNumber = metric.ChangeNumber, MasterEnvironment = metric.MasterEnvironment, 
                //    RolloutName=metric.RolloutName, StageName=metric.StageName } into g
            return query;
        }

        [ResponseType(typeof(RolloutDetails))]
        public async Task<IHttpActionResult> GetRolloutDetails(int id)
        {
            List<RolloutDetails> metric = await db.RolloutDetailsTable.Where(x => x.ChangeNumber == id)
                .OrderBy(x => x.StartTime).ThenBy(x => x.StageName).ToListAsync();
            if (metric == null)
            {
                return NotFound();
            }

            return Ok(metric);
        }

        [ResponseType(typeof(RolloutDetails))]
        public async Task<IHttpActionResult> GetRolloutDetailsLastN(int n)
        {
            string query = n > 0 ? @"
                select r.* from rolloutstageduration as r join 
                (select top " + n + @" changenumber, starttime from StageRolloutSummary order by starttime desc) as s on r.changeNumber = s.changenumber
                order by s.starttime desc, r.StartTime asc, r.StageName" : @"
                select r.* from
                StageRolloutSummary s join rolloutstageduration r on s.changenumber = r.changenumber
                order by s.starttime desc, r.startTime asc, r.stageName";
            List<RolloutDetails> metric = await db.RolloutDetailsTable.SqlQuery(query).ToListAsync();
            if (metric == null)
            {
                return NotFound();
            }

            return Ok(metric);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}