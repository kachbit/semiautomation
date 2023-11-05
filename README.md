# semiautomation

## Process
### login:
1. Send a POST request to the login page to authenticate and retrieve a new stateToken.
1. If the request is successful, store the retrieved stateToken.
1. Use the stateToken to send a POST request to submit the password and finalize login.
1. If the login successful, scrape the HTML data of the seminary modules page - this will be used to locate the lesson url for the current day

### locate current lesson:
