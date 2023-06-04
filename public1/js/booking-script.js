var date = new Date();
var tdate = date.getDate();
var month = date.getMonth()+1;
if(tdate < 10){
    tdate = '0' + tdate;
}
if(month < 10){
    month = '0' + month;
}
var year = date.getUTCFullYear();
var minDate = year + "-" + month + "-" + tdate;
document.getElementById("datepicker").setAttribute('min',minDate);
console.log(minDate);

var hour = date.getHours();
var minute = date.getMinutes();
if(hour < 10){
    hour = '0' + hour;
}
if(minute < 10){
    minute = '0' + minute;
}
var minTime = hour + ":" + minute;
//document.getElementById("timepicker").setAttribute('min',minTime);
//console.log(minTime); 
