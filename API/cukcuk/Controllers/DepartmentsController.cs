using cukcuk.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;

namespace cukcuk.Controllers
{
    [Route("api/v1/departments")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        /// <summary>
        /// hàm xử lí ngoại lệ thông báo lỗi cho dev và người dùng
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        private IActionResult HandleException(Exception ex)
        {
            var error = new ErrorService();
            error.DevMsg = ex.Message;
            error.UserMsg = Resources.ResourceVI.error_exception;
            return StatusCode(500, error);
        }
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                //Chuỗi kết nối
                string connectionString = "Host=localhost;Port=3306; " +
                "Database=cukcuk;" +
                "User Id=root;" +
                "Password=root";
                //Khởi tạo kết nối
                var connection = new MySqlConnection(connectionString);
                //Khai báo câu lệnh sql
                var sqlCommand = "SELECT * FROM Department";
                var departments = connection.Query<Department>(sqlCommand);
                return StatusCode(200,departments);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        /// <summary>
        /// Lấy ra department theo id
        /// </summary>
        /// <param name="DepartmentId"></param>
        /// <returns>department</returns>
        [HttpGet("{DepartmentId}")]
        public IActionResult Get(Guid DepartmentId)
        {
            try
            {

                //Chuỗi kết nối
                string connectionString = "Host=localhost;Port=3306; " +
                "Database=cukcuk;" +
                "User Id=root;" +
                "Password=root";
                //Khởi tạo kết nối
                var connection = new MySqlConnection(connectionString);
                DynamicParameters dynamicParams = new DynamicParameters();
                dynamicParams.Add("@DepartmentId", DepartmentId);
                var sqlCommand = "SELECT * FROM Department WHERE DepartmentId = @DepartmentId";
                var department = connection.QueryFirstOrDefault<Department>(sqlCommand, param:dynamicParams);
                return Ok(department);
            }
            catch(Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}
