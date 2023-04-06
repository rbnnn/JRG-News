// references to our functions
const register = firebase.functions().httpsCallable('register');
const unsubscribe = firebase.functions().httpsCallable('unsubscribe');
const current = firebase.functions().httpsCallable('getPreferences');
const updatePref = firebase.functions().httpsCallable('updatePreferences');

// retrieving user ID from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

window.onload = function () {
    // if unsubscribe page is loaded
    if (document.getElementById('unsub')) {
        // calling unsubscribe function, id is parameter passed
        unsubscribe({ userid: id })
            .then((result) => {
                console.log(result);
                // message for unsubscribe
                document.querySelector(".message").innerHTML = "Unsubscribed from Newsletter.";
            })
            .catch((error) => {
                console.error(error);
                // message for error
                document.querySelector(".message").innerHTML = "Unable to unsubscribe from newsletter.";
            });

        // if preferences page is loaded        
    } else if (document.getElementById('update')) {
        //get current preferences
        current({ userid: id })
            .then((result) => {
                const data = result.data;
                const topics = data.topics;
                document.getElementById("name").innerHTML = data.name;
                document.getElementById("email").innerHTML = data.email;

                // pre-checking our form to show user what preferences they have 
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                for (const checkbox of checkboxes) {
                    if (topics.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                }
            })
            .catch((error) => {
                // couldn't get data
                document.getElementById("name").innerHTML = "Unable to retrieve data";
            });

        // lilstener for submitting the preference form
        document.getElementById('submit-button').addEventListener('click', (event) => {
            event.preventDefault();

            console.log("submit pressed")

            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const newtopics = [];

            // retrieving which topics are checked
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    newtopics.push(checkbox.value);
                }
            });

            console.log("new preferences: " + newtopics)

            // calling update function, passing user ID & function data
            updatePref({ userid: id, newData: { topics: newtopics } })
                .then((result) => {
                    console.log("Preferences updated.", result);
                    alert("Update success. Your new preferences have been saved.");
                })
                .catch((error) => {
                    console.error("Preferences not updated.", error);
                    alert("Updating preferences could not be completed, please try again.");
                });
        });

        // if on subscription page
    } else if (document.getElementById('newSub')) {
        // Add an event listener for the subscription form
        // will be moved to another page
        document.getElementById('submit-button').addEventListener('click', (event) => {
            event.preventDefault();

            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const topics = [];

            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    topics.push(checkbox.value);
                }
            });
            
            if (topics.length == 0) {
                alert("Please select at least one topic.");
            } else {
                // Get the data from your HTML form
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;

                const data = { name: name, email: email, topics: topics }
                // Call your Firebase Cloud Function and pass in the form data
                register(data)
                    .then((result) => {
                        console.log(result);

                        alert("Subscription success!");
                        // Data was successfully written to the Firestore database
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(error);
                        // There was an error writing data to the Firestore database
                    });
            };
        });
    }
};