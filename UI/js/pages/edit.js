
$(document).ready(function(){
    $("#txtHoTen").focus();
        // Lấy mã nhân viên từ api

        const urlParams = new URLSearchParams(window.location.search);
        const employeeId = urlParams.get('id');
        //Lấy phòng ban từ api

        getDepartment();
        //Lấy vị trí từ api
        getPosition();
        getEmployeeById(employeeId);
        
        $("#btn-save").click( function() {
            // 1. Validate dữ liệu
            let employeeId = urlParams.get('id');
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
            if(license_date) {
                license_date = new Date(license_date);
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
        
        // Hiển thị trạng thái validate khi không nhập dữ liệu
        $("input[required]").blur(function() {
            var me = this;
            validateInputRequired(me);
        });
    
        // Hiển thị phòng ban từ API
        
        

    
    });
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
            }
        },
        error: function(response) {
            console.error("Lỗi khi lấy phòng ban:", response);
        }
    });
}
//Hàm hiển thị nhân viên lên form
function getEmployeeById(id){
    $.ajax({
        type: "GET",
        url: `http://localhost:5236/api/v1/employees/${id}`,
        success: function(response) {
            $("#txtMaNV").val(response.EmployeeCode);
            $("#txtHoTen").val(response.FullName);
            //chuyển đổi định dạng ngày để hiển thị đúng dữ liệu
            let dob = new Date(response.DateOfBirth).toISOString().split('T')[0];
            $("#txtNgaySinh").val(dob);
            $("#vitri-dropdown").val(response.PositionId);
            $("#txtCMT").val(response.IdentityNumber);
            //chuyển đổi định dạng ngày để hiển thị đúng dữ liệu

            let identityDate  = new Date(response.IdentityDate).toISOString().split('T')[0];
            $("#txtNgayCap").val(identityDate);
            $("#phongban-dropdown").val(response.DepartmentId);
            console.log(response.DepartmentId);
            $("#txtNoiCap").val(response.IdentityPlace);
            $("#txtDiaChi").val(response.Address);
            $("#txtDTDD").val(response.PhoneNumber);
            $("#txtDTCD").val();
            $("#txtEmail").val(response.Email);
            $("#txtTKNganHang").val();
            $("#txtTenNganHang").val();
            $("#txtChiNhanh").val();
            $("#txtMaNV").prop('disabled', true);
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
            window.location.href = `../../../UI/pages/Edit.html?id=${employeeId}`;
        },
        error: function(response) {
            console.error("Error details:", response);
            alert("Sửa thất bại");
            $(".m-loading").hide();
             
            
        }
    });
}

function validateEmail(email) {
    // Biểu thức chính quy kiểm tra định dạng email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}