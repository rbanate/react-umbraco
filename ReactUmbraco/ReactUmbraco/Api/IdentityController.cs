using System.Web;
using System.Web.Http;
using System.Web.Security;
using Umbraco.Web.WebApi;
using Umbraco.Core.Services;
using Umbraco.Core.Models;
using ReactUmbraco.Models;
using ReactUmbraco.ViewModels;


namespace ReactUmbraco.Api
{
	[Route("api/[controller]")]
	public class IdentityApiController : UmbracoApiController
	{
	    private readonly IMemberService _memberService;

  
    
		public IdentityApiController()
		{
			_memberService = Services.MemberService;
		}


		[HttpGet]
		public IHttpActionResult GetMember(string email)
		{
			if (string.IsNullOrEmpty(email)) return BadRequest("Username or email not set");

		
			var member = _memberService.GetByEmail(email);

			if (member != null) return Ok(new { memberInfo = member });

			return Ok(new { memberInfo = new { error = "User not found" } });
		}

		[HttpGet]
		public IHttpActionResult MemberExists(string username)
		{
			if (string.IsNullOrEmpty(username)) return BadRequest("Username or email not set");

			var exists = DoesMemberExist(username);
          
			return Ok(new {exists});
		}

	    [HttpPost]
        [ValidateModelStateFilter]
	    public IHttpActionResult ValidateUser([FromBody] LoginViewModel login)
	    {
	        //if (login == null) return BadRequest("Login information not set");

            var validUser = Membership.ValidateUser(login.Username, login.Password);

            return Ok(new { validUser });
        }

		[HttpPost]
		[ValidateModelStateFilter]
        public IHttpActionResult CreateMember([FromBody]IdentityPortal member)
		{
			
			//if (member == null) return BadRequest("Member information not set");

			var memberExists = DoesMemberExist(member.Email);


			if (memberExists) return Ok(new { memberInfo = new { error = "Username already exists" } });

			var createdMember = _memberService.CreateWithIdentity(member.Email, member.Email, member.Password,
				"member");

			PopulateCustomFields(createdMember, member);

			_memberService.Save(createdMember, false);

			return Ok(new { memberInfo = createdMember });
		}

	    private bool DoesMemberExist(string username)
	    {
	        var exists = _memberService.Exists(username);

	        return exists;
	    }

		private void PopulateCustomFields(IMember createdMember, IdentityPortal input)
		{
			createdMember.SetValue("firstName", input.Firstname);
			createdMember.SetValue("lastName", input.Lastname);
			createdMember.SetValue("dateOfBirth", input.DateOfBirth);
			createdMember.SetValue("address", input.Address);
			createdMember.SetValue("passportNumber", input.PassportNumber);

			//var mandatoryDocsLink = new List<int>();

			//foreach (var document in input.MandatoryDocuments)
			//{
			//	mandatoryDocsLink.Add(UploadDocument(document, createdMember.Id));
			//}

			//createdMember.SetValue("mandatoryDocument",);
			//var supportingDocsLink = new List<int>();

			//foreach (var document in input.SupportingDocuments)
			//{
			//	supportingDocsLink.Add(UploadDocument(document, createdMember.Id));
			//}

		}

		private int UploadDocument(HttpPostedFileBase document, int memberId)
		{
			var mediaService = Services.MediaService;
			var newFile = mediaService.CreateMedia(document.FileName, -1, "Image", memberId);
			newFile.SetValue("umbracoFile", document);
			mediaService.Save(newFile);
			return newFile.Id;
		}
	}
}
