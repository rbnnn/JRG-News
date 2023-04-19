const addFeedback = firebase.functions().httpsCallable('addFeedback');

const feedbackForm = document.getElementById("feedback-form");

feedbackForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the data from your HTML form
    const name = feedbackForm.elements['name'].value;
    const email = feedbackForm.elements['email'].value;
    const message = feedbackForm.elements['message'].value;

    const data = { name: name, email: email, message: message }
    // Call your Firebase Cloud Function and pass in the form data
    addFeedback(data)
        .then((result) => {
            console.log(result);

            alert("Feedback submitted successfully!");
            // Data was successfully written to the Firestore database
        })
        .catch((error) => {
            console.error(error);
            alert(error);
            // There was an error writing data to the Firestore database
        });
});