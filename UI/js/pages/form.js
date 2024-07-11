
$(document).ready(function(){
    $("#btn-save").click(function(){
        //1.validate dữ liệu
         let employeeCode = $("#txtMaNV").val();
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
        
         if(dob){
            dob = new Date(dob);
         }
         if(dob > new Date()){
            alert("Ngày sinh k được lớn hơn ngày hiện tại");
         }
         let employee = {
            "EmployeeCode": employeeCode,
            "FullName" : name,
            "DateOfBirth" : dob,
            "Gender" : gender,
            "IdentityNumber": cin,
            "IdentityDate": license_date,
            "IdentityPlace": issued_by,
            "DepartmentId": department,
            "Address": address,
            "PhoneNumber": phone_number
         }

         //tạo ajax thêm 1 employee
         $.ajax({
            type: "POST",
            url:"https://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType:"json",
            contentType:"application/json",
            success: function(response){
                alert("Thêm thành công!");
                window.location.href = "../../pages/Employees.html";
            },
            error: function(response){
                alert("Thêm thất bại");
            }
         });
    });

    //Hiển thị trạng thái validate khi không nhập dữ liệu
    $("input[required]").blur(function(){
        var me = this;
        validateInputRequired(me);
    })
    //Hiển thị phòng ban từ API
    $.ajax({
        type: "GET",
        url: "https://cukcuk.manhnv.net/api/v1/Departments",
        success: function(response){
            for(let department of response){
                let departmentId = department.DepartmentId;
                let departmentName = department.DepartmentName;
                var el = `<option value="${departmentId}">${departmentName}</option>`;
                $("#phongban-dropdown").append(el);
            }
            
        },
        error: function(response){
            debugger
        }
    });
});
//validate dữ liệu  khi nhấn lưu
function validateInputRequired(input){
    var me = this;
    let value = $(input).val();
    if(value == null || value == ""){
        $(input).addClass("m-input-err");
        $(input).atrr("title","Thông tin này không được để trống!");
    }
    else{
        $(input).removeClass("m-input-err");
        $(input).removeAtrr("title");
    }
}