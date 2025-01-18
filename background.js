function getLocation(){
    const success = (position)=>{
        console.log(position);
        confirmation(position);
    }
    const errors = (error) =>{
        console.error(error);
    }
 const location = navigator.geolocation.getCurrentPosition(success,errors);
}
function confirmation(position){
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    console.log(longitude);
    console.log(latitude);
    console.log(position);

fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
    .then(res=>{
    return res.json()})
    .then (data =>{
    console.log(data.results);
    var sunriseUTC = data.results.sunrise;
    console.log(sunriseUTC);
    const sunrise = new Date(sunriseUTC);
    const timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localSunrise = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(sunrise);
console.log(sunrise);

 })
}

document.getElementById('button').addEventListener('click', (event) => {
    event.preventDefault();
deg = document.getElementById("opt");
const selectedValue = deg.value;

console.log(selectedValue);
});