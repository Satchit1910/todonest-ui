
# TodoNest UI

UI for TodoNest, a project and todo management app.

I have hosted the full-stack app using AWS services. Check it out [here](http://todonest-ui.s3-website-us-east-1.amazonaws.com).

This project is written using ReactJs. 

The API repository has to be set up first for the UI to work properly. <br>You can find the link to the TodoNest API repository [here](https://github.com/Satchit1910/todonest-api).


### Run Locally

Clone the project

```bash
git clone https://github.com/Satchit1910/todonest-ui
```

You have to add a **.env** file to the root directory of the project.

Format for .env file:
`REACT_APP_BASE_URL` = Base URL for making API calls to back-end.

Here, you need to provide the base URL for the TodoNest API.
If you are running the API locally, it would be something like *http://localhost:8080/api*. You have to provide the base URL including the */api* route, like this example. The port and other details can be configured in the API project.

Now you can run the React Project.

You have to first install all dependencies.
```bash
npm install
```

Then run the app :
```bash
npm start
```



