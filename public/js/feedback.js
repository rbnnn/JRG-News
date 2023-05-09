const addFeedback = firebase.functions().httpsCallable('addFeedback');

const feedbackForm = document.getElementById("feedback-form");

feedbackForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        // On feedback submit
        document.getElementById('submit-button').innerText = "Working...";

        // Retrieve name & email
        const name = feedbackForm.elements['name'].value;

        // Test for blank entries and return errors
        if (name == "") {
            throw new Error("Please enter your name.");
        }

        const email = feedbackForm.elements['email'].value;

        if (email == "") {
            throw new Error("Please enter your email.");
        }

        const message = feedbackForm.elements['message'].value;

        if (message == "") {
            throw new Error("Please add your message.");
        }

        const data = { name: name, email: email, message: message }
        // Call your Firebase Cloud Function and pass in the form data
        addFeedback(data)
            .then((result) => {
                console.log(result);
                document.getElementById('submit-button').innerText = "Submit Feedback";
                alert("Feedback submitted successfully!");
                // Data was successfully written to the Firestore database
            })
            .catch((error) => {
                console.error(error);
                document.getElementById('submit-button').innerText = "Submit Feedback";
                alert(error);
                // There was an error writing data to the Firestore database
            });
    } catch (e) {
        alert(e.message);
        document.getElementById('submit-button').innerText = "Submit Feedback";
    }
});