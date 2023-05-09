// References to our functions
const register = firebase.functions().httpsCallable('register');
const unsubscribe = firebase.functions().httpsCallable('unsubscribe');
const current = firebase.functions().httpsCallable('getPreferences');
const updatePref = firebase.functions().httpsCallable('updatePreferences');

// Retrieving user ID from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

window.onload = function () {
    // If unsubscribe page is loaded
    if (document.getElementById('unsub')) {
        // Calling unsubscribe function, id is parameter passed
        unsubscribe({ userid: id })
            .then((result) => {
                console.log(result);
                // Message for unsubscribe
                document.querySelector(".message").innerHTML = "Success.";
                alert("Unsubscribe success. You have been unsubscribed from JRG News.");
            })
            .catch((error) => {
                console.error(error);
                // Message for error
                document.querySelector(".message").innerHTML = "Error.";
                alert("Something went wrong. Please try again.");
            });

        // If preferences page is loaded        
    } else if (document.getElementById('update')) {
        const selectAllCheckbox = document.getElementById("select-all");
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#select-all)');

        selectAllCheckbox.addEventListener("change", function () {
            checkboxes.forEach((checkbox) => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });

        // Get current preferences
        current({ userid: id })
            .then((result) => {
                const data = result.data;
                const topics = data.topics;
                document.getElementById("name").innerHTML = data.name;
                document.getElementById("email").innerHTML = data.email;

                // Pre-checking our form to show user what preferences they have 
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                for (const checkbox of checkboxes) {
                    if (topics.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                }
            })
            .catch((error) => {
                // Couldn't get data
                document.getElementById("name").innerHTML = "Unable to retrieve data";
            });

        // Listener for submitting the preference form
        document.getElementById('submit-button').addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('submit-button').innerText = "Working...";
            console.log("submit pressed")

            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const newtopics = [];

            // Retrieving which topics are checked
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked && checkbox.id !== 'select-all') {
                    newtopics.push(checkbox.value);
                }
            });

            if (!validateCheckbox()) {
                alert("Please select at least one topic.");
                document.getElementById('submit-button').innerText = "Subscribe to Newsletter";
                return;
            }

            console.log("new preferences: " + newtopics)

            // Calling update function, passing user ID & function data
            updatePref({ userid: id, newData: { topics: newtopics } })
                .then((result) => {
                    console.log("Preferences updated.", result);
                    document.getElementById('submit-button').innerText = "Update Preferences";
                    alert("Update success. Your new preferences have been saved.");
                })
                .catch((error) => {
                    console.error("Preferences not updated.", error);
                    document.getElementById('submit-button').innerText = "Update Preferences";
                    alert("Updating preferences could not be completed, please try again.");
                });

            // Checks which checkboxes are checked and then added to an array
            function validateCheckbox() {
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                let isChecked = false;

                checkboxes.forEach((checkbox) => {
                    if (checkbox.checked) {
                        isChecked = true;
                    }
                });

                return isChecked;
            }
        });

        // If on subscription page
    } else if (document.getElementById('newSub')) {
        const selectAllCheckbox = document.getElementById("select-all");
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#select-all)');

        // When select all is selected, all boxes are checked/unchecked
        selectAllCheckbox.addEventListener("change", function () {
            checkboxes.forEach((checkbox) => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });

        // Add an event listener for the subscription form
        document.getElementById('submit-button').addEventListener('click', (event) => {

            try {
                event.preventDefault();

                document.getElementById('submit-button').innerText = "Working...";

                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                const topics = [];

                // Makes sure not to push select-all
                checkboxes.forEach((checkbox) => {
                    if (checkbox.checked && checkbox.id !== 'select-all') {
                        topics.push(checkbox.value);
                    }
                });

                // Get the data from your HTML form
                const name = document.getElementById('name').value;

                // Checks for empty entries and returns errors/alerts
                if (name == "") {
                    throw new Error("Please enter your name.");
                }

                const email = document.getElementById('email').value;

                if (email == "") {
                    throw new Error("Please enter your email.");
                }

                if (!validateCheckbox()) {
                    throw new Error("Please select at least one topic.");
                }

                const data = { name: name, email: email, topics: topics }
                // Call your Firebase Cloud Function and pass in the form data
                register(data)
                    .then((result) => {
                        console.log(result);
                        document.getElementById('submit-button').innerText = "Subscribe to Newsletter";
                        alert("Subscription success!");
                        // Data was successfully written
                    })
                    .catch((error) => {
                        console.error(error);
                        document.getElementById('submit-button').innerText = "Subscribe to Newsletter";
                        alert(error);
                        // There was an error writing data
                    });

            } catch (e) {
                alert(e.message);
                document.getElementById('submit-button').innerText = "Subscribe to Newsletter";
            }

        });

        // Checks which checkboxes are checked and then added to an array
        function validateCheckbox() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            let isChecked = false;

            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    isChecked = true;
                }
            });

            return isChecked;
        }
    }
};