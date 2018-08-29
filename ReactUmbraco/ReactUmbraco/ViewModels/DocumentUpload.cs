using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ReactUmbraco.ViewModels
{
    public class DocumentUpload : IValidatableObject
    {
        public int MemberId { get; set; }
        public DocumentTypes DocumentType { get; set; }
        public IEnumerable<HttpPostedFileBase> MandatoryDocuments { get; set; }
        public IEnumerable<HttpPostedFileBase> SupportingDocuments { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (DocumentType <= 0) yield return new ValidationResult("Please select a valid Document Type");
            if (MemberId <= 0) yield return new ValidationResult("Please provide a valid member Id");
            if (MandatoryDocuments == null) yield return new ValidationResult("Please provide Mandatory Documents");
            if(DocumentType == DocumentTypes.PassportOtherCountries && SupportingDocuments == null) yield return new ValidationResult("Please provide Supporting Documents");
        }
    }
}