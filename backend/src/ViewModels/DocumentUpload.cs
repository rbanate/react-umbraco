using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ReactUmbraco.ViewModels
{
    public class DocumentUpload : IValidatableObject
    {
        public string Email { get; set; }
        public DocumentTypes DocumentType { get; set; }
        public IEnumerable<Document> MandatoryDocuments { get; set; }
        public IEnumerable<Document> SupportingDocuments { get; set; }
        public IEnumerable<Document> OtherDocuments { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (DocumentType <= 0) yield return new ValidationResult("Please select a valid Document Type");
            if (string.IsNullOrEmpty(Email)) yield return new ValidationResult("Please provide a valid member Id");
            if (MandatoryDocuments == null) yield return new ValidationResult("Please provide Mandatory Documents");
            if(DocumentType == DocumentTypes.PassportOtherCountries && SupportingDocuments == null) yield return new ValidationResult("Please provide Supporting Documents");
        }
    }

    public class Document
    {
        public string FileName { get; set; }
        public string Base64 { get; set; }
        public string DocType { get; set; }
    }
 
}