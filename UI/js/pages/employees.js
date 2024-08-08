$(document).ready(function () {
  //Hiển thị form
  $(".m-btn-icon-add").click(function () {
    $("#dlgDialog").show();
    $("#txtHoTen").focus();

  });
  //Ẩn form
  $(".m-dialog-close").click(function () {
    $("#dlgDialog").hide();
  });
  //Ẩn form edit
  $(".m-dialog-close-edit").click(function () {
    $("#dlgDialog-edit").hide();
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
  //Chi tiết nhân viên
  let id = 0;//Khai báo mã nhân viên
  $("#table-employees tbody").on("click", "tr", function() {
    $("#dlgDialog-edit").show();
    $("#txtHoTen-edit").focus();

    // Lấy Employee ID từ dòng được click
    id  = $(this).data("id");
        //Lấy phòng ban từ api
    getDepartment();
      //Lấy vị trí từ api
    getPosition();
    getEmployeeById(id);
  });
  //Xử lí sửa nhân viên
  $("#btn-edit").click( function() {
    // 1. Validate dữ liệu
    let employeeId = id;
    let EmployeeCode = $("#txtMaNV-edit").val();
    let name = $("#txtHoTen-edit").val();
    let dob = $("#txtNgaySinh-edit").val();
    let position = $("#vitri-dropdown-edit").val();
    let gender = $("input[name='gioitinh-edit']:checked").val();
    let cin = $("#txtCMT-edit").val();
    let license_date = $("#txtNgayCap-edit").val();
    let department = $("#phongban-dropdown-edit").val();
    let issued_by = $("#txtNoiCap-edit").val();
    let address = $("#txtDiaChi-edit").val();
    let phone_number = $("#txtDTDD-edit").val();
    let landline_phone_number = $("#txtDTCD-edit").val();
    let email = $("#txtEmail-edit").val();
    let bank_account_number = $("#txtTKNganHang-edit").val();
    let bank_name = $("#txtTenNganHang-edit").val();
    let branch_name = $("#txtChiNhanh-edit").val();
    if(dob) {
        dob = new Date(dob);
    }
    else{
        dob = null;
    }
    if(license_date) {
        license_date = new Date(license_date);
    }
    else{
        license_date = null;
    }
    if(name == null || name === ""){
        alert("Nhập thông tin họ tên!");
        return;
    }
    if(cin == null || cin === ""){
        alert("Nhập số CMTND!");
        return;
    }
    if(validateEmail(email)== false){
        alert("Nhập email đúng định dạng!");
        return;
    }
    if(phone_number == null || phone_number ==="" ){
        alert("Nhập số điện thoại!");
        return;
    }
    // Check ngày sinh và ngày cấp không được lớn hơn ngày hiện tại
    if(dob > new Date() || license_date > new Date()) {
        alert("Ngày sinh và ngày cấp không được lớn hơn ngày hiện tại");
        return;
    }
    $(".m-loading").show();
    
    // Tạo đối tượng employee
    let employee = {
        "EmployeeCode": EmployeeCode,
        "FullName": name,
        "DateOfBirth": dob,
        "Gender": gender,
        "IdentityNumber": cin,
        "IdentityDate": license_date,
        "IdentityPlace": issued_by,
        "DepartmentId": department,
        "PositionId": position,
        "Address": address,
        "PhoneNumber": phone_number,
        "Email": email
    }
    // gọi hàm sửa nhân viên
    editEmployee(employee,employeeId);
  });

  //Bấm vào nút x 
  $("#table-employees tbody").on("click", "#m-delete", function(event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click từ phần tử cha
    var employeeId = $(this).closest("tr").data("id"); //lấy id của employee
    //  hiển thị popup xóa
    $(".confirm-delete").show();
    //bấm đồng ý xóa
    $("#m-confirm").click(function(){
    $(".confirm-delete").hide();
      $(".m-loading").show();
      //xử lí xóa
      deleteEmployee(employeeId);

    })
  });
  $("#m-cancel").click(function(){
    $(".confirm-delete").hide();
  })

  //xử lí thêm mới

  $("#txtHoTen").focus();
  // Lấy mã nhân viên từ api
  getEmployeeCode();
  getPosition();
  //Lấy phòng ban từ api
        getDepartment();
        $("#btn-save").click(async function() {
            // 1. Validate dữ liệu
            let EmployeeCode = $("#txtMaNV").val();
            let name = $("#txtHoTen").val();
            let dob = $("#txtNgaySinh").val();
            let position = $("#vitri-dropdown").val();
            let gender = $("input[name='gioitinh']:checked").val();
            let cin = $("#txtCMT").val();
            let license_date = $("#txtNgayCap").val();
            let department = $("#phongban-dropdown").val();
            let issued_by = $("#txtNoiCap").val();
            let address = $("#txtDiaChi").val();
            let phone_number = $("#txtDTDD").val();
            let landline_phone_number = $("#txtDTCD").val();
            let email = $("#txtEmail").val();
            let bank_account_number = $("#txtTKNganHang").val();
            let bank_name = $("#txtTenNganHang").val();
            let branch_name = $("#txtChiNhanh").val();
            
            if(dob) {
                dob = new Date(dob);
            }
            else{
                dob=null;
            }
            if(license_date) {
                license_date = new Date(license_date);
            }
            else{
                license_date = null;
            }
            if(name == null || name === ""){
                alert("Nhập thông tin họ tên!");
                return;
            }
            if(cin == null || cin === ""){
                alert("Nhập số CMTND!");
                return;
            }
            if(validateEmail(email)== false){
                alert("Nhập email đúng định dạng!");
                return;
            }
            if(phone_number == null || phone_number ==="" ){
                alert("Nhập số điện thoại!");
                return;
            }
            
            // Check ngày sinh và ngày cấp không được lớn hơn ngày hiện tại
            if(dob > new Date() || license_date > new Date()) {
                alert("Ngày sinh và ngày cấp không được lớn hơn ngày hiện tại");
                return;
            }
            
            $(".m-loading").show();
            
            // Tạo đối tượng employee
            let employee = {
                "EmployeeCode": EmployeeCode,
                "FullName": name,
                "DateOfBirth": dob,
                "Gender": gender,
                "IdentityNumber": cin,
                "IdentityDate": license_date,
                "IdentityPlace": issued_by,
                "DepartmentId": department,
                "PositionId": position,
                "Address": address,
                "PhoneNumber": phone_number,
                "Email": email
            }
            // gọi hàm thêm nhân viên
            AddEmployee(employee);
        });
        
        // Hiển thị trạng thái validate khi không nhập dữ liệu
        $("input[required]").blur(function() {
            var me = this;
            validateInputRequired(me);
        });
    
});

//Hàm load data
function loadData(pageSize, pageNumber){//Hàm load data
  return new Promise(function(resolve, reject){
    $.ajax({
      type: "GET",
      url: `http://localhost:5236/api/v1/employees/Filter?pageSize=${pageSize}&pageNumber=${pageNumber}`,
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
        let gender = employee.GenderName;
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
                    <td>
                     <div class="control-row-container">
                     ${address}
                                    <div class="control-row" >
                                        <img id="m-delete" src="../assets/icon/close-1.svg">
                                    </div>
                                </div>
                    </td>
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
            let data = response.Employees;
            let totalItems = response.TotalRecords;//Lấy tổng số bản ghi
            renderTable(data,pageSize, pageNumber); // render table(data là dữ liệu employee, pageSize là số bản ghi/trang, pageNumber là số trang hiện tại)
            $(".m-loading").hide();
            $("#total").text(`Tổng: ${totalItems}`);
        } catch (error) {
            console.error("Lỗi khi tải và hiển thị dữ liệu:", error);
            $(".m-loading").hide();
        }

}

//Hàm xóa nhân viên
function deleteEmployee(employeeId){
  $.ajax({
    type: "DELETE",
    url: `http://localhost:5236/api/v1/employees/${employeeId}`,
    success: function(response){
      loadDataAndRenderTable(100,1);
      $(".confirm-delete").hide();
      alert("Xóa thành công!");
    },

    error: function (response) {
      alert("Xóa thất bại!");
      $(".m-loading").hide();
    }
  });
}

//Hàm của form 
//validate dữ liệu  khi nhấn lưu
function validateInputRequired(input){
    var me = this;
    let value = $(input).val();
    if(value == null || value == ""){
        $(input).addClass("m-input-err");
    }
    else{
        $(input).removeClass("m-input-err");
    }
}
//hàm gọi api mã nhân viên
function getEmployeeCode(){
    $.ajax({
        type: "GET",
        url: "http://localhost:5236/api/v1/employees/NewEmployeeCode",
        success: function(response) {
            $("#txtMaNV").val(response);
            $("#txtMaNV").prop('disabled', true);
        },
        error: function(response) {
            alert("Có lỗi khi tạo mã nhân viên");
        }
       
    });
}
//hàm lấy ra danh sách phòng ban
function getDepartment(){
    $.ajax({
        type: "GET",
        url: "http://localhost:5236/api/v1/departments",
        success: function(response) {
            for(let department of response) {
                let departmentId = department.DepartmentId;
                let departmentName = department.DepartmentName;
                var el = `<option value="${departmentId}">${departmentName}</option>`;
                $("#phongban-dropdown").append(el);
                $("#phongban-dropdown-edit").append(el);

            }
        },
        error: function(response) {
            console.error("Lỗi khi lấy phòng ban:", response);
        }
    });
}
//Hàm lấy ra danh sách vị trí
function getPosition(){
    $.ajax({
        type: "GET",
        url: "http://localhost:5236/api/v1/Positions",
        success: function(response) {
            for(let position of response) {
                let positionId = position.PositionId;
                let positionName = position.PositionName;
                var el = `<option value="${positionId}">${positionName}</option>`;
                $("#vitri-dropdown").append(el);
                $("#vitri-dropdown-edit").append(el);

            }
        },
        error: function(response) {
            console.error("Lỗi khi lấy phòng ban:", response);
        }
    });
}
//hàm gọi api thêm nhân viên
function AddEmployee(employee){
    
    $.ajax({
        type: "POST",
        url: "http://localhost:5236/api/v1/employees",
        data: JSON.stringify(employee),
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
            $(".m-loading").hide();
            alert("Thêm thành công!");
            window.location.href = "../../../UI/UI/pages/Employees.html";

        },
        error: function(response) {
            alert("Thêm thất bại");
            $(".m-loading").hide();
             
            
        }
    });
}
//Hàm check email
function validateEmail(email) {
    // Biểu thức chính quy kiểm tra định dạng email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

//Hàm hiển thị nhân viên lên form
function getEmployeeById(id){
    $.ajax({
        type: "GET",
        url: `http://localhost:5236/api/v1/employees/${id}`,
        success: function(response) {
            $("#txtMaNV-edit").val(response.EmployeeCode);
            $("#txtHoTen-edit").val(response.FullName);
            //chuyển đổi định dạng ngày để hiển thị đúng dữ liệu
            let dob = moment(response.DateOfBirth).format('YYYY-MM-DD');
            $("#txtNgaySinh-edit").val(dob);
            $("#vitri-dropdown-edit").val(response.PositionId);
            $("#txtCMT-edit").val(response.IdentityNumber);
            //chuyển đổi định dạng ngày để hiển thị đúng dữ liệu

            let identityDate  = moment(response.IdentityDate).format('YYYY-MM-DD');
            $("#txtNgayCap-edit").val(identityDate);
            $("#phongban-dropdown-edit").val(response.DepartmentId);
            $("#txtNoiCap-edit").val(response.IdentityPlace);
            $("#txtDiaChi-edit").val(response.Address);
            $("#txtDTDD-edit").val(response.PhoneNumber);
            $("#txtDTCD-edit").val();
            $("#txtEmail-edit").val(response.Email);
            $("#txtTKNganHang-edit").val();
            $("#txtTenNganHang-edit").val();
            $("#txtChiNhanh-edit").val();
            $("#txtMaNV-edit").prop('disabled', true);
        },
        error: function(response) {
            console.error("Lỗi khi lấy dữ liệu nhân viên:", response);
        }
    });
}
//hàm gọi api sửa nhân viên
function editEmployee(employee,employeeId){
        $.ajax({
        type: "PUT",
        url: `http://localhost:5236/api/v1/employees/${employeeId}`,
        data: JSON.stringify(employee),
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
            $(".m-loading").hide();
            alert("Sửa thành công!");
            window.location.href = "../../../UI/UI/pages/Employees.html";

        },
        error: function(response) {
            console.error("Error details:", response);
            alert("Sửa thất bại");
            $(".m-loading").hide();
             
            
        }
    });
}
