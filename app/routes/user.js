const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;


    app.get(`${baseUrl}/all`, auth.isAuthorized, userController.getAllIssue);


    // params: userId.
   // app.get(`${baseUrl}/:userId/details`, auth.isAuthorized, userController.getSingleUser);

   app.get(`${baseUrl}/:receiverName/details`, auth.isAuthorized, userController.getSingleUser);

   app.get(`${baseUrl}/:receiverName/reporterDetails`, auth.isAuthorized, userController.getIssueReporter);

   app.get(`${baseUrl}/get/for/user`,  userController.getUsersIssue);

   app.get(`${baseUrl}/:issueId`,  userController.getSingleIssue);

   app.get(`${baseUrl}/:issueData/search`, auth.isAuthorized, userController.getSingleSearch);

   app.get(`${baseUrl}/:issueId/commentDetails`,  userController.getComments);

   app.get(`${baseUrl}/:issueId/watcherDetails`,  userController.getWatcher);

   app.get(`${baseUrl}/:receiverName/issueWatcherDetails`,  userController.getIssueWatcher);

   
    // params: firstName, lastName, email, mobileNumber, password, apiKey.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    app.post(`${baseUrl}/create`,  userController.createIssue);

    app.post(`${baseUrl}/comment`,  userController.createComment);

    app.post(`${baseUrl}/watcher`,  userController.createWatcher);

    




   

    app.post(`${baseUrl}/login`,  userController.loginFunction);

    app.put(`${baseUrl}/:issueId/edit`, auth.isAuthorized, userController.editIssue);

    app.post(`${baseUrl}/:userId/delete`, auth.isAuthorized, userController.deleteUser);

    

    app.post(`${baseUrl}/logout`, auth.isAuthorized, userController.logout);

}
