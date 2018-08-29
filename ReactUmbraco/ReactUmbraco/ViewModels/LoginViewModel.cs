using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReactUmbraco.Models
{
    public class LoginViewModel:  IValidatableObject
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if(string.IsNullOrEmpty(Username)) yield return new ValidationResult("Please provide Username");

            if (string.IsNullOrEmpty(Password)) yield return new ValidationResult("Please provide Password");
        }
    }
}