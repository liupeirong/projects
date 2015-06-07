using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Google.Apis.Analytics.v3;

namespace GoogleAnalyticsAuth
{
    class Program
    {
        static string clientId = "867844411126-ltsmbg34sfav6vpg7tnom4snobu9kf7a.apps.googleusercontent.com";
        static string clientSecret = "H3pXYgobOqmKA2uSjD_xrI2l";
        static string gaUser = "liupeirong@gmail.com";
        static string gaApplication = "GoogleComputeProj";
        static string profileId = "ga:53582227";
        static string oauthTokenFilestorage = "GoogleComputeProj Storage";
        
        static void Main(string[] args)
        {
            Console.WriteLine("Analytics API Sample: List MyLibrary");
            Console.WriteLine("================================");
            try
            {
                new Program().Run().Wait();
            }
            catch (AggregateException ex)
            {
                foreach (var e in ex.InnerExceptions)
                {
                    Console.WriteLine("ERROR: " + e.Message);
                }
            }
            Console.WriteLine("Press any key to continue...");
            Console.ReadKey();
        }

        private async Task Run()
        {
            UserCredential credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    new ClientSecrets
                    {
                        ClientId = clientId,
                        ClientSecret = clientSecret
                    },
                    new[] { AnalyticsService.Scope.AnalyticsReadonly },
                    gaUser, 
                    CancellationToken.None, 
                    new FileDataStore(oauthTokenFilestorage));

            // Create the service.
            var service = new AnalyticsService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = gaApplication,
                });

            // query data
            string start = new DateTime(2014, 1, 1).ToString("yyyy-MM-dd");
            string end = new DateTime(2015, 6, 7).ToString("yyyy-MM-dd");
            var query = service.Data.Ga.Get(profileId, start, end, "ga:visitors");

            query.Dimensions = "ga:visitCount, ga:date, ga:visitorType";
            query.Filters = "ga:visitorType==New Visitor";
            query.SamplingLevel = DataResource.GaResource.GetRequest.SamplingLevelEnum.HIGHERPRECISION;

            var response = query.Execute();

            Console.WriteLine("Entries in result: {0}", response.TotalResults);
            Console.WriteLine("You had : {0} new visitors from {1} to {2}"
                , response.TotalsForAllResults.First(), start, end);
            Console.WriteLine("Has more data: {0}", response.NextLink == null);
            Console.WriteLine("Sample data: {0}", response.ContainsSampledData);
        }
    }
}
