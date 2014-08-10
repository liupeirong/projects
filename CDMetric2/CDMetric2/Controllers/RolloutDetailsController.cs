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

        /// <summary>
        /// Get api/RolloutDetails
        /// </summary>
        /// <returns></returns>
        public IQueryable<RolloutDetails> GetRolloutDetails()
        {
            IQueryable<RolloutDetails> query =
                from metric in db.RolloutDetailsTable.Distinct()
                orderby metric.ChangeNumber, metric.StartTime ascending
                select metric;
                //group metric by new RolloutDetails { ChangeNumber = metric.ChangeNumber, MasterEnvironment = metric.MasterEnvironment, 
                //    RolloutName=metric.RolloutName, StageName=metric.StageName } into g
            return query;
        }

        /// <summary>
        /// look up metric by name, GET api/RolloutDetails/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(RolloutDetails))]
        public async Task<IHttpActionResult> GetRolloutDetails(int id)
        {
            List<RolloutDetails> metric = await db.RolloutDetailsTable.Where(x => x.ChangeNumber == id).ToListAsync();
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