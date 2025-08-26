
document.addEventListener('DOMContentLoaded', () => {
    // Attach the event listener to the form submission
    const form = document.getElementById('lol');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page refresh

        // Store the selected value before calling getLocation()
        const deg = document.getElementById("opt");
        const selectedValue = deg.value;
        console.log("Before Click: ", document.getElementById("opt").value);

        getLocation();

        setTimeout(() => {
            console.log("After Click: ", document.getElementById("opt").value);
        }, 200);
        

        // Restore the selected value after processing
        setTimeout(() => {
            document.getElementById("opt").value = selectedValue;
        }); 
    });
});


function getLocation() {
    const success = (position) => {
        console.log(position); // Logs the position object
        confirmation(position); // Pass position to the next function
    };

    const errors = (error) => {
        console.error(error);
    };

    // Request geolocation
    navigator.geolocation.getCurrentPosition(success, errors);
}

function confirmation(position) {
    const longitude = position.coords.longitude;
    const latitude = position.coords.latitude;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Fetch today's sunset
    fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data.results);
            const deg = document.getElementById("opt");
            const selectedValue = deg.value;
            console.log(`Selected value: ${selectedValue}`); // Log the selected degree option
            const sunsetUTC = data.results.sunset;
            const sunset = new Date(sunsetUTC);

            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const year = tomorrow.getFullYear();
            const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Fixed parentheses
            const day = String(tomorrow.getDate()).padStart(2, '0'); // Fixed parentheses
            const tomorrowDate = `${year}-${month}-${day}`;

            // Fetch tomorrow's sunrise
            fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0&date=${tomorrowDate}`)
                .then((res) => res.json())
                .then((data) => {
                    const fajr18 = new Date(data.results.astronomical_twilight_begin); // -18° Fajr
                    const fajr12 = new Date(data.results.nautical_twilight_begin); // -12° Fajr
                    const fajr15 = new Date((fajr18.getTime() + fajr12.getTime()) / 2);
                    if(deg.value==12){
                        sunrise= new Date(fajr12);
                    }
                    else if(deg.value==15){
                        sunrise= new Date(fajr15);
                    }
                    else if(deg.value==18){
                        sunrise= new Date(fajr18);
                    }
                    else{
                        console.log("Invalid option");
                    }
                    // Convert sunrise and sunset to local time
                    const localSunrise = new Intl.DateTimeFormat('en-US', {
                        timeZone: timezone,
                        timeStyle: 'short',
                    }).format(sunrise);

                    const localSunset = new Intl.DateTimeFormat('en-US', {
                        timeZone: timezone,
                        timeStyle: 'short',
                    }).format(sunset);
                        const midnight = timeDifference(localSunset, localSunrise);

                    console.log(`Local Sunrise (Tomorrow): ${localSunrise}`);
                    console.log(`Local Sunset (Today): ${localSunset}`);
                    console.log(`Midnight: ${midnight}`);
                    showMidnight(midnight,meridian);
                });
        });
}

function timeDifference(startTime, endTime) {
    function convertToMinutes(time) {
        const [hourMin, meridian] = time.split(" ");
        let [hours, minutes] = hourMin.split(":").map(Number);

        // Convert to 24-hour format
        if (meridian.toLowerCase() === "pm" && hours !== 12) {
            hours += 12;
        }
        if (meridian.toLowerCase() === "am" && hours === 12) {
            hours = hours;
        }

        return hours * 60 + minutes;
    }

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    let diff = endMinutes - startMinutes;

    // Handle case where end time is on the next day
    if (diff < 0) {
        diff += 24 * 60; // Add 24 hours in minutes
    }

    diff = startMinutes+ Math.floor(diff/2);

    if(diff >= 24*60){
        diff -= 24*60;
        meridian = "AM";
    }

    // Convert back to hours and minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}:${String(minutes).padStart(2, '0')} ${meridian}`;
}
function showMidnight(midnight,meridian){
    if(meridian=="AM"){
    const date = new Date();
            date.setDate(date.getDate() + 1);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Fixed parentheses
            const day = String(date.getDate()).padStart(2, '0'); // Fixed parentheses
            const finalDate = `${year}/${month}/${day}`;
        document.getElementById("time").innerHTML = `<h2> Isha ends at ${midnight} ${finalDate}  </h2>`;
    }
    else{
        const date = new Date();
        const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Fixed parentheses
            const day = String(date.getDate()).padStart(2, '0'); // Fixed parentheses
            const finalDate = `${year}-${month}-${day}`;
        document.getElementById("time").innerHTML = `<h2> Isha ends at ${midnight} ${finalDate} </h2>`;

    }
    

}