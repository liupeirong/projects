using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CDMetric2.Startup))]
namespace CDMetric2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
          
        }
    }
}
