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
    public class RolloutSummaryController : ApiController
    {
        private MetricContext db = new MetricContext();

        // GET api/RolloutSummary
        public IQueryable<RolloutSummary> GetRolloutSummaries()
        {
            IQueryable<RolloutSummary> query =
                from metric in db.RolloutSummaries
                orderby metric.StartTime descending
                select metric;
            return query;
        }

        // GET api/RolloutSummary/5
        [ResponseType(typeof(RolloutSummary))]
        public async Task<IHttpActionResult> GetRolloutSummary(int id)
        {
            RolloutSummary rolloutsummary = await db.RolloutSummaries.FindAsync(id);
            if (rolloutsummary == null)
            {
                return NotFound();
            }

            return Ok(rolloutsummary);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RolloutSummaryExists(int id)
        {
            return db.RolloutSummaries.Count(e => e.ChangeNumber == id) > 0;
        }
    }
}