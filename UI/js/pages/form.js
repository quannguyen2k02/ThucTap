
$(document).ready(function(){
        // Lấy mã nhân viên từ api
        getEmployeeCode();
        //Lấy phòng ban từ api
        getDepartment();
        $("#btn-save").click(async function() {
            // 1. Validate dữ liệu
            let EmployeeCode = $("#txtMaNV").val();
            let name = $("#txtHoTen").val();
            let dob = $("#txtNgaySinh").val();
            let position = $("#txtViTri").val();
            let gender = $("input[name='gioitinh']:checked").val();
            let cin = $("#txtCMT").val();
            let license_date = $("#txtNgayCap").val();
            let department = $("#txtPhongBan").val();
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
//hàm gọi api mã nhân viên
function getEmployeeCode(){
    $.ajax({
        type: "GET",
        url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
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
        url: "https://cukcuk.manhnv.net/api/v1/Departments",
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
//hàm gọi api thêm nhân viên
function AddEmployee(employee){
    $.ajax({
        type: "POST",
        url: "https://cukcuk.manhnv.net/api/v1/Employees",
        data: JSON.stringify(employee),
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
            $(".m-loading").hide();
            alert("Thêm thành công!");
            window.location.href = "../../pages/Employees.html";
        },
        error: function(response) {
            alert("Thêm thất bại");
            $(".m-loading").hide();
             
            
        }
    });
}