function submitForm() {
    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    // Combine country code and phone number
    const fullPhoneNumber = countryCode + phoneNumber;

    // Prepare data for the HTTP request
    const data = {
        phoneNumber: fullPhoneNumber,
        password: password
    };

    // Make the HTTP request using the fetch API
    fetch('https://your-api-endpoint.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}