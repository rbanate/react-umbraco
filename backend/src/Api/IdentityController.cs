using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web;
using System.Web.Security;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Umbraco.Web.WebApi;
using Umbraco.Core.Services;
using Umbraco.Core.Models;
using ReactUmbraco.Models;
using ReactUmbraco.ViewModels;


namespace ReactUmbraco.Api
{
    [EnableCors("*", "*", "*")] //TODO: Should only allow known API users
    [Route("api/[controller]")]
    public class IdentityApiController : UmbracoApiController
    {
        private readonly IMemberService _memberService;
        private readonly IMediaService _mediaService;


        public IdentityApiController()
        {
            _memberService = Services.MemberService;
            _mediaService = Services.MediaService;
        }


        [HttpGet]
        public IHttpActionResult GetMemberRaw(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Username or email not set");


            var member = GetMemberDetails(email);

            if (member != null) return Ok(new { memberInfo = member });

            return Ok(new { memberInfo = new { error = "User not found" } });
        }

        [HttpGet]
        public IHttpActionResult GetMember(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Username or email not set");


            var member = GetMemberDetails(email);

            var json = JsonConvert.SerializeObject(ConvertRawMember(member), new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });

    

            if (member != null) return Ok(new { memberInfo = json });

            return Ok(new { memberInfo = new { error = "User not found" } });
        }

        private IdentityPortalView ConvertRawMember(IMember member)
        {
            var mandatoryDocs = member.GetValue<string>("mandatoryDocument");
            var supportingDocs = member.GetValue<string>("supportingDocument");
            var mandatoryDocsMedia = new List<string>();
            var supportingDocsMedia = new List<string>();
            var mediaPrefix = "umb://media/";

            if (mandatoryDocs != null)
            {
                var mediaGuids = ExtractGuids(mandatoryDocs.Replace(mediaPrefix, "").Split(',').ToList());

                mandatoryDocsMedia =
                    GetMediaFiles(mediaGuids).ToList();

            }

            if (supportingDocs != null)
            {
                var mediaGuids = ExtractGuids(supportingDocs.Replace(mediaPrefix, "").Split(',').ToList());

                supportingDocsMedia = GetMediaFiles(mediaGuids).ToList();
    
            }

            var identity = new IdentityPortalView
            {
                Firstname = member.GetValue<string>("firstName"),
                Email = member.Email,
                Lastname = member.GetValue<string>("lastName"),
                DateOfBirth = member.GetValue<DateTime?>("dateOfBirth"),
                Address = member.GetValue<string>("address"),
                PassportNumber = member.GetValue<string>("passportNumber"),
                DocumentType = member.GetValue<string>("identityDocType"),

                MandatoryDocuments = mandatoryDocsMedia,
                SupportingDocuments = supportingDocsMedia,


            };

            return identity;
        }

        private IEnumerable<Guid> ExtractGuids(IEnumerable<string> keys)
        {
            var mediaGuids = new List<Guid>();
            foreach (var key in keys)
            {
                try
                {
                    var guid = Guid.ParseExact(key, "N");
                    mediaGuids.Add(guid);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw new ApplicationException(key);
                }
              
            }

            return mediaGuids;
        }

        [System.Web.Http.HttpGet]
        public IHttpActionResult MemberExists(string username)
        {
            if (string.IsNullOrEmpty(username)) return BadRequest("Username or email not set");

            var exists = DoesMemberExist(username);

            return Ok(new { exists });
        }

        [System.Web.Http.HttpPost]
        [ValidateModelStateFilter]
        public IHttpActionResult ValidateUser([FromBody] LoginViewModel login)
        {

            var validUser = Membership.ValidateUser(login.Username, login.Password);

            return Ok(new { validUser });
        }

        #region Create Member

        [System.Web.Http.HttpPost]
        [ValidateModelStateFilter]
        public IHttpActionResult CreateMember([FromBody]IdentityPortal member)
        {
            var memberExists = DoesMemberExist(member.Email);


            if (memberExists) return Ok(new { error = "Username already exists" });

            var createdMember = _memberService.CreateMemberWithIdentity(member.Email, member.Email,
                $"{member.Firstname} {member.Lastname}",
                "member");

            _memberService.SavePassword(createdMember, member.Password);

            PopulateCustomFields(createdMember, member);

            _memberService.Save(createdMember);

            return Ok(new { memberInfo = createdMember });
        }

        public IHttpActionResult UpdateMember([FromBody] IdentityPortalUpdate member)
        {
            var memberExists = DoesMemberExist(member.Email);
            if (!memberExists) return Ok(new { error = "User does not exists" });

            var existingMember = GetMemberDetails((member.Email));

            PopulateCustomFields(existingMember, member);

            _memberService.Save(existingMember, false);

            var json = JsonConvert.SerializeObject(ConvertRawMember(existingMember), new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });

            return Ok(new { memberInfo = json });
        }

        private void PopulateCustomFields(IMember createdMember, IdentityPortal input)
        {
            createdMember.SetValue("firstName", input.Firstname);
            createdMember.SetValue("lastName", input.Lastname);
      
            createdMember.SetValue("dateOfBirth", input.DateOfBirth);
            createdMember.SetValue("address", input.Address);
            createdMember.SetValue("passportNumber", input.PassportNumber);
        }

        private void PopulateCustomFields(IMember createdMember, IdentityPortalUpdate input)
        {
            createdMember.SetValue("firstName", input.Firstname);
            createdMember.SetValue("lastName", input.Lastname);
            createdMember.SetValue("dateOfBirth", input.DateOfBirth);
            createdMember.SetValue("address", input.Address);
            createdMember.SetValue("passportNumber", input.PassportNumber);
        }


        #endregion

        [System.Web.Http.HttpGet]
        public IHttpActionResult GetMedia(int key)
        {
            var media = _mediaService.GetById(key);

            return Ok(new { media });
        }


        private IEnumerable<string> GetMediaFiles(IEnumerable<Guid> keys)
        {
            var mediaFiles = _mediaService.GetByIds(keys);

            return mediaFiles.Select(media => media.GetValue<string>("umbracoFile")).ToList();
        }

        #region Upload Documents

        [System.Web.Http.HttpPost]
        [ValidateModelStateFilter]
        public IHttpActionResult UploadMemberDocuments([FromBody]DocumentUpload upload)
        {
            var member = GetMemberDetails(upload.Email);

            if (member == null) return BadRequest("Member not found");
            try
            {
                var mandatoryDocsLink = SaveDocumentsToMedia(upload.MandatoryDocuments, member.Id);

                member.SetValue("mandatoryDocument", mandatoryDocsLink);
                member.SetValue("identityDocType", (int)upload.DocumentType);

                if (upload.SupportingDocuments != null)
                {
                    var supportingDocsLink = SaveDocumentsToMedia(upload.SupportingDocuments, member.Id);

                    member.SetValue("supportingDocument", supportingDocsLink);
                }

                if (upload.OtherDocuments != null)
                {
                    var otherDocsLink = SaveDocumentsToMedia(upload.OtherDocuments, member.Id);

                    member.SetValue("otherDocument", otherDocsLink);
                }

                _memberService.Save(member);
              

                var json = JsonConvert.SerializeObject(ConvertRawMember(member), new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });


                return Ok(new { memberInfo = json });
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Ok(new { error = upload });
            }


        }

        private string SaveDocumentsToMedia(IEnumerable<Document> documents, int memberId)
        {
            var docsLink = new StringBuilder();

            foreach (var document in documents)
            {
                var base64Image = ConvertBase64ToString(document);
                var key = UploadDocument(document, base64Image, memberId);
                var location = $"umb://media/{key}";
                docsLink.Append(location + ",");
            }

            return docsLink.ToString().TrimEnd(',');
        }

        private Stream ConvertBase64ToString(Document document)
        {
            var cleanedSource = document.Base64.Replace($"data:{document.DocType};base64,", ""); //document.Base64.Replace("data:image/jpeg;base64,", ""); 
            var bytes = Convert.FromBase64String(cleanedSource);
            var contents = new MemoryStream(bytes);

            return contents;
        }

        private string UploadDocument(Document document, Stream stream, int memberId)
        {

            var newFile = _mediaService.CreateMedia(document.FileName, -1, "Image", memberId);
            newFile.SetValue("umbracoFile", document.FileName, stream);
            _mediaService.Save(newFile);
            return newFile.Key.ToString("N");
        }

        #endregion

        #region Helper Methods

        private bool DoesMemberExist(string username)
        {
            var exists = _memberService.Exists(username);

            return exists;
        }

        private IMember GetMemberDetails(string email)
        {
            if (string.IsNullOrEmpty(email)) return null;


            var member = _memberService.GetByEmail(email);

            return member;
        }

        private IMember GetMemberDetails(int memberId)
        {
            if (memberId <= 0) return null;


            var member = _memberService.GetById(memberId);

            return member;
        }

        #endregion


    }
}
