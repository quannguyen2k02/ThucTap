using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Dapper;
using MySqlConnector;
using cukcuk.Models;
using System.Data;
using System.Text.RegularExpressions;

namespace cukcuk.Controllers
{
    [Route("api/v1/employees")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        /// <summary>
        /// Lấy ra mã nhân viên mới để thêm mới
        /// </summary>
        /// <returns>mã nhân viên có dạng NVxxx</returns>
        [HttpGet("NewEmployeeCode")]
        public IActionResult NewEmployeeCode()
        {
            try
            {

            //Khai báo thông tin máy chủ    
            string connectionString = "Host=localhost;Port=3306; " +
                "Database=cukcuk;" +
                "User Id=root;" +
                "Password=root";
                //Khởi tạo kết nối
                var connection = new MySqlConnection(connectionString);
                var sqlCommand = "SELECT * FROM Employee ORDER BY CreatedDate DESC LIMIT 1;";
                var employee = connection.QuerySingleOrDefault<Employee>(sqlCommand);//Lấy ra nhân viên mới nhất
                string a = Regex.Replace(employee.EmployeeCode, @"[^\d]", ""); //Lấy ra số sau nv

                string newEmployeeCode = $"NV{int.Parse(a) + 1}";
                return StatusCode(200, newEmployeeCode);
            }
            catch(Exception ex)
            {
                return HandleException(ex);
            }
        }
        [HttpGet]
        public IActionResult Get()
        {
            try
            {

            //Khai báo thông tin máy chủ    
            string connectionString = "Host=localhost;Port=3306; " +
                "Database=cukcuk;" +
                "User Id=root;" +
                "Password=root";
            //Khởi tạo kết nối
            var connection = new MySqlConnection(connectionString);
            //Khai báo câu truy vấn dữ liệu
            var sql = "SELECT * FROM Employee ORDER BY CreatedDate DESC";
            var employees = connection.Query<Employee>(sql);
            //Trả về
            //return Ok();
            return StatusCode(200, employees);
            }
            catch (Exception ex)
            {
                return HandleException(ex); 
            }
        }
        /// <summary>
        /// Tìm nhân viên theo Id
        /// </summary>
        /// <param name="EmployeeId"></param>
        /// <returns>trả về nhân viên</returns>
        [HttpGet("{EmployeeId}")]
        public IActionResult Get(Guid EmployeeId)
        {
            try
            {
                string connectionString = "Host=localhost;Port=3306; " +
                "Database=cukcuk;" +
                "User Id=root;" +
                "Password=root";
                //Khởi tạo kết nối
                var connection = new MySqlConnection(connectionString);
                //Khai báo câu truy vấn dữ liệu tìm theo mã nhân viên

                var sql = $"SELECT * FROM Employee WHERE EmployeeId = @EmployeeId";
                //nếu có tham số truyền cho câu lệnh truy vấn thì phải sử dụng DynamicParameter
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@EmployeeId", EmployeeId);
                var employee = connection.QueryFirstOrDefault<Employee>(sql, param: parameters);
                return StatusCode(200, employee);
            }
            catch(Exception ex)
            {
                return HandleException(ex);
            }
            
        }
        //Hàm check email
        private bool IsValidEmail(string? email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return false;
            }
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false; // suggested by @TK-421
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }
        //Hàm xử lí ngoại lệ
        private IActionResult  HandleException(Exception ex)
        {
            var error = new ErrorService();
            error.DevMsg = ex.Message;
            error.UserMsg = Resources.ResourceVI.error_exception;
            return StatusCode(500, error);
        }
        /// <summary>
        /// thêm mới nhân viên
        /// </summary>
        ///     <param name="employee">Thông tin nhân viên  </param>
        /// <returns>
        /// 201: thêm thành công
        /// 400: dữ liệu đầu vào không hợp lệ
        /// </returns>
        [HttpPost]
        public IActionResult Post(Employee employee)
        {
            try
            {
                //khai báo các thông tin cần thiết
                var error = new ErrorService();
                var errorData = new Dictionary<string, string>();
                //1.Validate dữ liệu

                //Mã nhân viên bắt buộc nhập
                if (string.IsNullOrEmpty(employee.EmployeeCode))
                {
                    errorData.Add("EmloyeeCode", Resources.ResourceVI.error_EmployeeCode_IsNotEmpty);
                }
                if (checkEmployeeCode(employee.EmployeeCode))
                {
                    errorData.Add("EmloyeeCode",Resources.ResourceVI.error_EmployeeCode_IsDuplicate);

                }
                if (string.IsNullOrEmpty(employee.FullName))
                {
                    errorData.Add("FullName", Resources.ResourceVI.error_FullName_IsNotEmpty);
                }
                if (!IsValidEmail(email: employee.Email) && !string.IsNullOrEmpty(employee.Email))//Khi email có dữ liệu nhập thì mới validate
                {
                    errorData.Add("Email", Resources.ResourceVI.error_Email_IsNotValid);
                }
                if(employee.DateOfBirth > DateTime.Now)
                {
                    errorData.Add("DateOfBirth", Resources.ResourceVI.error_DOB_IsNotValid);
                }
                if (employee.IdentityDate > DateTime.Now)
                {
                    errorData.Add("DateOfBirth", Resources.ResourceVI.error_IdDate_IsNotValid);
                }
                if (errorData.Count > 0)
                {
                    error.UserMsg = "Dữ liệu đầu vào không hợp lệ.";
                    error.Data = errorData;
                    return BadRequest(error);
                }
                //Khởi tạo kết nối
                string connectionString = "Host=localhost;Port=3306; " +
                 "Database=cukcuk;" +
                 "User Id=root;" +
                 "Password=root";
                var connection = new MySqlConnection(connectionString);
                //Thực hiện thêm mới vào db
                //var sqlcommand = "INSERT INTO employee (CreatedDate, CreatedBy, ModifiedDate, ModifiedBy, EmployeeId, EmployeeCode, FirstName, LastName, Gender, DateOfBirth, PhoneNumber, Email, Address, IdentityNumber, IdentityDate, IdentityPlace, DepartmentId, PositionId, Salary, PositionCode, PositionName, DepartmentCode, DepartmentName, FullName)" +
                //    "  VALUES (@CreatedDate, @CreatedBy, @ModifiedDate, @ModifiedBy, @EmployeeId, @EmployeeCode, @FirstName, @LastName, @Gender, @DateOfBirth, @PhoneNumber, @Email, @Address, @IdentityNumber, @IdentityDate, @IdentityPlace, @DepartmentId, @PositionId, @Salary, @PositionCode, @PositionName, @DepartmentCode, @DepartmentName, @FullName);";
                var sqlCommand = "Proc_InsertEmployee";
                employee.EmployeeId = Guid.NewGuid();
                var dynamicParams = new DynamicParameters();
                dynamicParams.Add("@m_EmployeeId",employee.EmployeeId);
                dynamicParams.Add("@m_CreatedDate",DateTime.Now);
                dynamicParams.Add("@m_CreatedBy", employee.CreatedBy);
                dynamicParams.Add("@m_EmployeeCode",employee.EmployeeCode);
                dynamicParams.Add("@m_ModifiedDate",DateTime.Now);
                dynamicParams.Add("@m_ModifiedBy",employee.ModifiedBy);
                dynamicParams.Add("@m_FirstName",employee.FirstName);
                dynamicParams.Add("@m_LastName",employee.LastName);
                dynamicParams.Add("@m_Gender",employee.Gender);
                dynamicParams.Add("@m_DateOfBirth",employee.DateOfBirth);
                dynamicParams.Add("@m_PhoneNumber",employee.PhoneNumber);
                dynamicParams.Add("@m_Email", employee.Email);
                dynamicParams.Add("@m_Address",employee.Address);
                dynamicParams.Add("@m_IdentityNumber",employee.IdentityNumber);
                dynamicParams.Add("@m_IdentityDate",employee.IdentityDate);
                dynamicParams.Add("@m_IdentityPlace",employee.IdentityPlace);
                dynamicParams.Add("@m_DepartmentId",employee.DepartmentId);
                dynamicParams.Add("@m_PositionId",employee.PositionId);
                dynamicParams.Add("@m_Salary",employee.Salary);
                dynamicParams.Add("@m_PositionCode",employee.PositionCode);
                dynamicParams.Add("@m_PositionName",employee.PositionName);
                dynamicParams.Add("@m_DepartmentCode",employee.DepartmentCode);
                dynamicParams.Add("@m_DepartmentName",employee.DepartmentName);
                dynamicParams.Add("@m_FullName",employee.FullName);
                var res = connection.Execute(sqlCommand, param: dynamicParams,commandType: System.Data.CommandType.StoredProcedure);
                return StatusCode(201,res);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
            
        }/// <summary>
         /// check trùng mã nhân viên
         /// </summary>
         /// <param name="EmployeeCode"></param>
         /// <returns>false khi bị trùng</returns>
        private bool checkEmployeeCode(string EmployeeCode)
        {
            //Khởi tạo kết nối
            string connectionString = "Host=localhost;Port=3306; " +
             "Database=cukcuk;" +
             "User Id=root;" +
             "Password=root";
            var connection = new MySqlConnection(connectionString);
            var sql = "SELECT EmployeeCode FROM Employee WHERE EmployeeCode = @EmployeeCode";
            var dynamicParams = new DynamicParameters();
            dynamicParams.Add("@EmployeeCode", EmployeeCode);
            var res = connection.QueryFirstOrDefault<string>(sql, param: dynamicParams);
            if (res != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        /// <summary>
        /// Sửa thông tin nhân viên 
        /// </summary>
        /// <param name="employee"></param>
        /// <returns></returns>
        [HttpPut("{EmployeeId}")]
        public IActionResult Put(Employee employee, Guid EmployeeId)
        {
            try
            {
                //khai báo các thông tin cần thiết
                var error = new ErrorService();
                var errorData = new Dictionary<string, string>();
                //Khởi tạo kết nối
                string connectionString = "Host=localhost;Port=3306; " +
                 "Database=cukcuk;" +
                 "User Id=root;" +
                 "Password=root";
                var connection = new MySqlConnection(connectionString);
                //1.Validate dữ liệu

                if (string.IsNullOrEmpty(employee.FullName))
                {
                    errorData.Add("FullName", Resources.ResourceVI.error_FullName_IsNotEmpty);
                }
                if (!IsValidEmail(email: employee.Email) && !string.IsNullOrEmpty(employee.Email))//Khi email có dữ liệu nhập thì mới validate
                {
                    errorData.Add("Email", Resources.ResourceVI.error_Email_IsNotValid);
                }
                if (errorData.Count > 0)
                {
                    error.UserMsg = "Dữ liệu đầu vào không hợp lệ.";
                    error.Data = errorData;
                    return BadRequest(error);
                }
                var sqlCommand = "Proc_UpdateEmployee";
                var dynamicParams = new DynamicParameters();
                dynamicParams.Add("@m_EmployeeId", EmployeeId);
                dynamicParams.Add("@m_CreatedBy", employee.CreatedBy);
                dynamicParams.Add("@m_ModifiedDate", DateTime.Now);
                dynamicParams.Add("@m_ModifiedBy", employee.ModifiedBy);
                dynamicParams.Add("@m_FirstName", employee.FirstName);
                dynamicParams.Add("@m_LastName", employee.LastName);
                dynamicParams.Add("@m_Gender", employee.Gender);
                dynamicParams.Add("@m_DateOfBirth", employee.DateOfBirth);
                dynamicParams.Add("@m_PhoneNumber", employee.PhoneNumber);
                dynamicParams.Add("@m_Email", employee.Email);
                dynamicParams.Add("@m_Address", employee.Address);
                dynamicParams.Add("@m_IdentityNumber", employee.IdentityNumber);
                dynamicParams.Add("@m_IdentityDate", employee.IdentityDate);
                dynamicParams.Add("@m_IdentityPlace", employee.IdentityPlace);
                dynamicParams.Add("@m_DepartmentId", employee.DepartmentId);
                dynamicParams.Add("@m_PositionId", employee.PositionId);
                dynamicParams.Add("@m_Salary", employee.Salary);
                dynamicParams.Add("@m_PositionCode", employee.PositionCode);
                dynamicParams.Add("@m_PositionName", employee.PositionName);
                dynamicParams.Add("@m_DepartmentCode", employee.DepartmentCode);
                dynamicParams.Add("@m_DepartmentName", employee.DepartmentName);
                dynamicParams.Add("@m_FullName", employee.FullName);
                var res = connection.Execute(sqlCommand, param: dynamicParams, commandType: System.Data.CommandType.StoredProcedure);
                return StatusCode(201, res);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        /// <summary>
        /// Xóa 1 nhân viên 
        /// </summary>
        /// <param name="EmployeeId"></param>
        /// <returns></returns>
        [HttpDelete("{EmployeeId}")]
        public IActionResult Delete(Guid EmployeeId)
        {
            try
            {
            //Khởi tạo kết nối
            string connectionString = "Host=localhost;Port=3306; " +
             "Database=cukcuk;" +
             "User Id=root;" +
             "Password=root";
            var connection = new MySqlConnection(connectionString);
            DynamicParameters dynamicParams = new DynamicParameters();
            dynamicParams.Add("@EmployeeId", EmployeeId);
            var sqlCommand ="DELETE FROM Employee WHERE EmployeeId = @EmployeeId" ;
            var res = connection.Execute(sqlCommand, param:dynamicParams);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        /// <summary>
        /// Phân trang
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="pageNumber"></param>
        /// <returns></returns>
        [HttpGet("Filter")]
        public IActionResult GetEmployees(int pageSize, int pageNumber)
        {
            try
            {

                //Khởi tạo kết nối
                string connectionString = "Host=localhost;Port=3306; " +
                 "Database=cukcuk;" +
                 "User Id=root;" +
                 "Password=root";
                var connection = new MySqlConnection(connectionString);
                //truy vấn
                var sqlQuery = @"
            SELECT * FROM Employee 
            ORDER BY CreatedDate DESC
            LIMIT @PageSize OFFSET @Offset;
            SELECT COUNT(*) FROM Employee;";
                DynamicParameters dynamicParams = new DynamicParameters();
                dynamicParams.Add("@PageSize", pageSize);
                dynamicParams.Add("@Offset", ((pageNumber - 1) * pageSize));
                using (var multi = connection.QueryMultiple(sqlQuery, dynamicParams))
                {
                    var employees = multi.Read<Employee>().ToList();
                    var totalRecords = multi.ReadFirst<int>();

                    var result = new
                    {
                        TotalRecords = totalRecords,
                        PageNumber = pageNumber,
                        PageSize = pageSize,
                        Employees = employees

                    };

                    return Ok(result);
                }
            }
            catch( Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}
