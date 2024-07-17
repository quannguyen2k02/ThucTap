$(document).ready(function () {
  $(".m-btn-icon-add").click(function () {
    window.location.href = "../pages/form.html"
  });
  $(".m-loading").show();
  //loadDataAndRender();
  loadDataAndRenderTable(100,1);
  let currentPage = 1;
  //thay đổi số lượng bản ghi/trang
  $('#pageSize').change(function () {
    currentPage = 1;
    var selectedValue = $(this).val();
    loadDataAndRenderTable(selectedValue, 1);

  });
  //xử lý khi bấm next page
  $("#m-next").click(function(){
    var pageSize = $("#pageSize").val();
    currentPage++;
    loadDataAndRenderTable(pageSize, currentPage);
  })
  //xử lý khi bấm pre page
  $("#m-pre").click(function(){
    if(currentPage > 1) {
      var pageSize = $("#pageSize").val();
      currentPage--;
      loadDataAndRenderTable(pageSize, currentPage);
    }
  })

  $("#table-employees tbody").on("click", "tr", function() {
    // Lấy Employee ID từ dòng được click
    var employeeId = $(this).data("id");
    // Chuyển hướng đến trang chỉnh sửa với Employee ID trong URL
    window.location.href = "Edit.html?id=" + employeeId;
  });
});
//demo
// function loadDataAndRender(){
//   $.ajax({
//     type: "GET",
//     url: "https://cukcuk.manhnv.net/api/v1/Employees",
//     success: function (response) {
      
//       var number = 0;
//       for (const employee of response) {
//         let employeeCode = employee.EmployeeCode;
//         let fullName = employee.FullName;
//         let gender = employee.Gender === 2 ? "Nữ" : "Nam";
//         let dob = new Date(employee.DateOfBirth).toLocaleDateString();
//         let email = employee.Email;
//         let address = employee.Address;
//         number ++;
//         var el = `<tr>
//                     <td>${number}</td>
//                     <td>${employeeCode}</td>
//                     <td>${fullName}</td>
//                     <td>${gender}</td>
//                     <td>${dob}</td>
//                     <td>${email}</td>
//                     <td>${address}</td>
//                   </tr>`
//         $("#table-employees").append(el);
        
//       }
//       $(".m-loading").hide();
//       $("#total").text(`Tổng: ${response.length}`);
//     },
//     err: function (response) {
//       console.error("Lỗi khi lấy danh sách nhân viên:", response);
//       debugger
//     }
//   });
// }


//Hàm load data
function loadData(pageSize, pageNumber){//Hàm load data
  return new Promise(function(resolve, reject){
    $.ajax({
      type: "GET",
      url: `https://cukcuk.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      success: function(response){
        resolve(response);  
      },

      error: function (response) {
        console.error("Lỗi khi lấy danh sách nhân viên:", response);
        reject(response);
      }
    });
  });
}

//Hàm hiển thị dữ liệu vào bảng
function renderTable(data,pageSize, pageNumber){
  $("#table-employees tbody").empty();

      let number = (pageNumber - 1) * pageSize;
      for (const employee of data) {
        let employeeCode = employee.EmployeeCode;
        let fullName = employee.FullName;
        let gender = employee.Gender === 2 ? "Nữ" : "Nam";
        let dob = new Date(employee.DateOfBirth).toLocaleDateString();
        let email = employee.Email;
        let address = employee.Address;
        number ++;
        var el = `<tr data-id="${employee.EmployeeId}"> 
                    <td>${number}</td>
                    <td>${employeeCode}</td>
                    <td>${fullName}</td>
                    <td>${gender}</td>
                    <td>${dob}</td>
                    <td>${email}</td>
                    <td>${address}</td>
                  </tr>`
        $("#table-employees tbody").append(el);
      }

}
//Hàm load data và render table
async function loadDataAndRenderTable(pageSize, pageNumber){
  $(".m-loading").show();
        try {
          //Chờ load data
            let response = await loadData(pageSize, pageNumber);
            let data = response.Data;
            let totalItems = response.TotalRecord;//Lấy tổng số bản ghi
            renderTable(data,pageSize, pageNumber); // render table(data là dữ liệu employee, pageSize là số bản ghi/trang, pageNumber là số trang hiện tại)
            $(".m-loading").hide();
            $("#total").text(`Tổng: ${totalItems}`);
        } catch (error) {
            console.error("Lỗi khi tải và hiển thị dữ liệu:", error);
            $(".m-loading").hide();
        }

}

//Hàm thay đổi số bản ghi trên 1 trang
