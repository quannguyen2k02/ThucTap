using cukcuk.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using Dapper;
namespace cukcuk.Controllers
{
    [Route("api/v1/Positions")]
    [ApiController]
    public class PositionsController : ControllerBase
    {   
        //Hàm xử lí và trả về lỗi
        private IActionResult HandleException(Exception ex)
        {
            var error = new ErrorService();
            error.DevMsg = ex.Message;
            error.UserMsg = Resources.ResourceVI.error_exception;
            return StatusCode(500, error);
        }
        /// <summary>
        /// trả về danh sách position
        /// </summary>
        /// <returns></returns>
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
                var sqlCommand = "SELECT * FROM Position";
                var positions = connection.Query<Position>(sqlCommand);
                return StatusCode(200, positions);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
        [HttpGet("{PositionId}")]
        public IActionResult Get(Guid PositionId)
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
                var sqlCommand = "SELECT * FROM Position WHERE PositionId = @PositionId";
                DynamicParameters dynamicParams = new DynamicParameters();
                dynamicParams.Add("@PositionId", PositionId);
                var position = connection.Query<Position>(sqlCommand, param: dynamicParams);
                return Ok(position);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}
