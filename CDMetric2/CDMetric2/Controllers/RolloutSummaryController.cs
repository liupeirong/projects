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

        public IQueryable<RolloutSummary> GetRolloutSummaries()
        {
            IQueryable<RolloutSummary> query =
                from metric in db.RolloutSummaries
                orderby metric.StartTime descending
                select metric;

            foreach (var rollout in query)
            {
                rollout.children = rollout.children.OrderBy(c => c.StartTime).ThenBy(c => c.StageName).ToList();
            }
            return query;
        }

        [ResponseType(typeof(RolloutSummary))]
        public async Task<IHttpActionResult> GetRolloutSummaries(int id)
        {
            RolloutSummary rolloutsummary = await db.RolloutSummaries.FindAsync(id);
            if (rolloutsummary == null)
            {
                return NotFound();
            }

            return Ok(rolloutsummary);
        }

        [ResponseType(typeof(RolloutSummary))]
        public async Task<IHttpActionResult> GetRolloutSummariesLastN(int n)
        {
            List<RolloutSummary> rolloutsummary = n > 0 ? 
                await db.RolloutSummaries.OrderByDescending(c => c.StartTime).Take(n).ToListAsync() :
                await db.RolloutSummaries.OrderByDescending(c => c.StartTime).ToListAsync();
            if (rolloutsummary == null)
            {
                return NotFound();
            }
            foreach (var rollout in rolloutsummary)
            {
                rollout.children = rollout.children.OrderBy(c => c.StartTime).ThenBy(c => c.StageName).ToList();
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