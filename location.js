
var openPopupBtn = document.getElementById('menu');
var sidebar = document.getElementById('sidebar')
openPopupBtn.addEventListener('click', function () {
    sidebar.classList.add('active');
    if(sidebar.classList.add('active')){
        sidebar.classList.remove('active')
    }
    else{
        sidebar.classList.add('active')
    }
});

closePopupBtn.addEventListener('click', function () {
    popup.classList.remove('active');
});

function logout() {
    // Clear user data from local storage
    localStorage.removeItem("userForm");
    // Redirect to login page
    window.location.href = "index.html";
}

window.onload = function () {
    // Load last checked-in location from local storage
    var lastLocation = JSON.parse(localStorage.getItem("lastLocation"));
    if (lastLocation) {
        updateCurrentLocation(lastLocation);
    }
};

function checkIn() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Use OpenStreetMap Nominatim API for reverse geocoding
                var nominatimUrl =
                    "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
                    latitude +
                    "&lon=" +
                    longitude;

                fetch(nominatimUrl)
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error("Failed to fetch");
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        var townName =
                            data.address.town ||
                            data.address.city ||
                            data.address.village ||
                            data.address.hamlet ||
                            "Unknown";
                        var locationInfo = {
                            town: townName,
                            latitude: latitude,
                            longitude: longitude,
                        };

                        // Save location data to local storage
                        var previousLocations =
                            JSON.parse(localStorage.getItem("previousLocations")) || [];
                        previousLocations.push(locationInfo);
                        localStorage.setItem(
                            "previousLocations",
                            JSON.stringify(previousLocations)
                        );

                        // Save last checked-in location to local storage
                        localStorage.setItem("lastLocation", JSON.stringify(locationInfo));

                        updateCurrentLocation(locationInfo);
                    })
                    .catch(function (error) {
                        console.log("Error fetching location data:", error);
                    });
            },
            function (error) {
                console.log("Error getting location:", error);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function updateCurrentLocation(locationInfo) {
    var currentLocation = document.getElementById("currentLocation");
    var previousLocation = document.getElementById("previousLocation");

    // Update current location
    currentLocation.innerHTML =
        "<li class='location_list'><img src='images/location.png' height='20px' width='20px'>" +
        locationInfo.town +
        "<br><div class='children'>" +
        locationInfo.latitude +
        "° N, " +
        locationInfo.longitude +
        "° E</div></li>";

    // Retrieve previous locations from local storage
    var previousLocations =
        JSON.parse(localStorage.getItem("previousLocations")) || [];

    // Exclude the current location from previous locations
    var previousLocationsExcludingCurrent = previousLocations.filter(function (
        prevLocation
    ) {
        return (
            prevLocation.latitude !== locationInfo.latitude ||
            prevLocation.longitude !== locationInfo.longitude
        );
    });

    // Add the current location to the list of previous locations
    previousLocationsExcludingCurrent.push(locationInfo);

    // Save the updated list of previous locations to local storage
    localStorage.setItem(
        "previousLocations",
        JSON.stringify(previousLocationsExcludingCurrent)
    );

    // Display all previous locations
    previousLocation.innerHTML = "";
    previousLocationsExcludingCurrent.forEach(function (location) {
        previousLocation.innerHTML +=
            "<li class='location_list'><img src='images/location.png' height='20px' width='20px'>" +
            location.town +
            "<br><div class='children'>" +
            location.latitude +
            "° N, " +
            location.longitude +
            "° E</div></li>";
    });
}
