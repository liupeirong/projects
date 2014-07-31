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
    public class MetricController : ApiController
    {
        private MetricContext db = new MetricContext();

        /// <summary>
        /// Get api/Metric
        /// </summary>
        /// <returns></returns>
        public IQueryable<Metric> GetMetrics()
        {
            IQueryable<Metric> query =
                from metric in db.Metrics.Distinct()
                select metric;
                //group metric by new Metric { ChangeNumber = metric.ChangeNumber, MasterEnvironment = metric.MasterEnvironment, 
                //    RolloutName=metric.RolloutName, StageName=metric.StageName } into g
            return query;
        }

        /// <summary>
        /// look up metric by name, GET api/Metric/5
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [ResponseType(typeof(Metric))]
        public async Task<IHttpActionResult> GetMetric(string id)
        {
            Metric metric = await db.Metrics.FindAsync(id);
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