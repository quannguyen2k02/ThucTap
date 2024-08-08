using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
namespace cukcuk.Models
{
    public class Employee
    {

        [JsonProperty("Name")]
        public DateTime ?CreatedDate { get; set; }
        public string ?CreatedBy { get; set; }
        public DateTime ?ModifiedDate { get; set; }
        public string ?ModifiedBy { get; set; }
        public Guid EmployeeId { get; set; }

        public string EmployeeCode { get; set; }
        public string ?FirstName { get; set; }
        public string ?LastName { get; set; }
        public int ?Gender { get; set; }
        public DateTime ?DateOfBirth { get; set; }
        public string ?PhoneNumber { get; set; }
        public string  ?Address { get; set; }
        public string ?IdentityNumber { get; set; }
        public DateTime ?IdentityDate { get; set; }
        public string ?IdentityPlace { get; set; }
        public Guid ?DepartmentId { get; set; }
        public Guid? PositionId { get; set; }
        public decimal? Salary { get; set; }
        public string? PositionCode { get; set; }
        public string? PositionName { get; set; }
        public string? DepartmentCode { get; set; }
        public string? DepartmentName { get; set; }

        public string FullName { get; set; }
        public string? Email { get; set; }
        public string GenderName
        {
            get
            {
                switch(Gender)
                {
                    case 1:
                        return "Nữ";
                    case 2:
                        return "Nam";
                    default:
                        return "Khác";
                }
            }
        }
    }
}
