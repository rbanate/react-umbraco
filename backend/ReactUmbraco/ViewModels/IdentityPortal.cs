using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactUmbraco.ViewModels
{
    public class IdentityPortal: IValidatableObject
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string PassportNumber { get; set; }
        public string Password { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrEmpty(Firstname)) yield return new ValidationResult("Please provide First name");
            if (string.IsNullOrEmpty(Lastname)) yield return new ValidationResult("Please provide Last name");
            if (string.IsNullOrEmpty(Email)) yield return new ValidationResult("Please provide Email address");
            if (string.IsNullOrEmpty(Password)) yield return new ValidationResult("Please provide Password");
            if (string.IsNullOrEmpty(PassportNumber))
                yield return new ValidationResult("Please provide Passport number");

        }

    }


    //public class IdentityPortalView : IdentityPortal, IValidatableObject
    //{
    //    public IEnumerable<string> MandatoryDocuments { get; set; }
    //    public IEnumerable<string> SupportingDocuments { get; set; }

    //    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    //    {
    //        throw new NotImplementedException();
    //    }
    //}

   
}
