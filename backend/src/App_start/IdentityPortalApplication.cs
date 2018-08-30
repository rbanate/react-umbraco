using System;
using System.Web.Http;
using Umbraco.Web;

namespace ReactUmbraco.EventHandlers
{
    public class WebApplication : UmbracoApplication
    {
        protected override void OnApplicationStarting(object sender, EventArgs e)
        {
            base.OnApplicationStarting(sender, e);
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}