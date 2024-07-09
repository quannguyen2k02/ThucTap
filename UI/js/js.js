var fruits = ["orange","apple","banana"];
fruits.push("durian"); // thêm phần tử vào cuối mảng
//fruits.unshift("orange"); thêm phần tử vào đầu mảng
console.log(fruits);
//fruits.pop();//xóa phần tử cuối mảng
//fruits.shift(); xóa phần tử đầu mảng
//fruits.splice(index,numberecord) index là vị trí phần tử, numberecord là số phần tử muốn xóa

//Forearch
// fruits.forEach(function(fruit){
//     console.log(fruit);
// })

//Sắp xếp mảng

//Filter lọc mảng theo điều kiện
var numbers = [1,2,3,4,5,6,7,8];
var evenNumbers = numbers.filter(function(number){
    return number %2 ===0;
})
console.log("test filter",evenNumbers);

//Map tạo mảng mới từ mảng hiện tại
var mapNumbers = numbers.map(function(number){
    return number * 2;
})
console.log("test map", mapNumbers)


//reduce
const objects = [
    {
        name:"quan",
        coin:20,
        old:20
    },
    {
        name:"quan",
        coin:30,
        old:19
    },
    {
        name:"quan",
        coin:50,
        old:18
    }
]

let totalCoin = objects.reduce(function(acc, cur){
    return acc + cur.coin;
}, 0)
console.log("reduce trả về 1 giá trị: ",totalCoin);

let totalAll = objects.reduce(function(acc, cur){
    acc.coin += cur.coin;
    acc.old += cur.old;
    return acc;
},{coin:0, old:0});

console.log("reduce trả về 1 đối tượng: ",totalAll);

//Tìm kiếm trong mảng

//Promise
//1.Pending
//2.Fulfilled
//3.Rejected
var promise = new Promise(
    // executer
    function(resolve, reject) {
        //Logic
        //Thành công: resolve
        //Thất bại: reject
        resolve([
            {
                id:1,
                name:"Javascript"
            }
        ]);
    }
); 

promise
    .then(function(course){
        console.log(course)
    })
    .catch(function(){
        console.log("Failure!")

    })
    .finally(function(){
        console.log("Done")

    });


var promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
        resolve([1]);
    },1000);
});

// var promise2 = new Promise(function(resolve, reject){
//     setTimeout(() => {
//        resolve([1,3,4]); 
//     }, 5000);
// });
var promise2 = Promise.reject("Co loi");

Promise.all([promise1, promise2])
    .then(function(result){
        console.log("Promise all:", result);
    })
    .catch(function(err){
        console.log("Error:", err);
    });