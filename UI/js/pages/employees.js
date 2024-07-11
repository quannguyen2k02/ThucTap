$(document).ready(function () {
  $(".m-btn-icon-add").click(function () {
    window.location.href = "../pages/form.html"
  });
  $(".m-loading").show();
  $.ajax({
    type: "GET",
    url: "https://cukcuk.manhnv.net/api/v1/Employees",
    success: function (response) {
      
      var number = 0;
      for (const employee of response) {
        let employeeCode = employee.EmployeeCode;
        let fullName = employee.FullName;
        let gender = employee.Gender === 2 ? "Nữ" : "Nam";
        let dob = new Date(employee.DateOfBirth).toLocaleDateString();
        let email = employee.Email;
        let address = employee.Address;
        number ++;
        var el = `<tr>
                    <td>${number}</td>
                    <td>${employeeCode}</td>
                    <td>${fullName}</td>
                    <td>${gender}</td>
                    <td>${dob}</td>
                    <td>${email}</td>
                    <td>${address}</td>
                  </tr>`
        $("#table-employees").append(el);
        
      }
      $(".m-loading").hide();

    },
    err: function (response) {
      console.error("Lỗi khi lấy danh sách nhân viên:", response);
      debugger
    }
  });
});