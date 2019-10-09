const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const passwordLib = require('./../libs/generatePasswordLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const token = require('../libs/tokenLib')
const AuthModel = mongoose.model('Auth')

/* Models */
const UserModel = mongoose.model('User')
const IssueModel = mongoose.model('Issue')

const CommentsModel = mongoose.model('Comments')

const Watcher1Model = mongoose.model('Watch1')

/* Get all user Details */
let getAllUser = (req, res) => {
    UserModel.find()
        .select(' -__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getAllUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller: getAllUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all users


/**
 * function to read all Issues.
 */
let getAllIssue = (req, res) => {
    IssueModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Issue Controller: getAllIssue', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'Issue Controller: getIssueBlog')
                let apiResponse = response.generate(true, 'No Issue Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Issue Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get all blogs

/* Get single user details */
let getSingleUser = (req, res) => {
    IssueModel.find({ 'assignedTo': req.params.receiverName })
        .select('-password -__v -_id')
        .sort('-created')
        .lean()
        .limit(10)
        .skip(parseInt(req.query.skip) || 0)
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user

/* Get single user details */
let getIssueReporter = (req, res) => {
    IssueModel.find({ 'reporter': req.params.receiverName })
        .select('-password -__v -_id')
        .sort('-created')
        .lean()
        .limit(10)
        .skip(parseInt(req.query.skip) || 0)
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleUser', 10)
                let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No User Found', 'User Controller:getSingleUser')
                let apiResponse = response.generate(true, 'No User Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'User Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get issue reporter details

/**
 * function to retrieve chat of the user.
 * params: receiverId, senderId, skip.
 */
let getUsersIssue = (req, res) => {
    // function to validate params.
    let validateParams = () => {
      return new Promise((resolve, reject) => {
        if (check.isEmpty(req.query.receiverName)) {
          logger.info('parameters missing', 'getUsersIssue handler', 9)
          let apiResponse = response.generate(true, 'parameters missing.', 403, null)
          reject(apiResponse)
        } else {
          resolve()
        }
      })
    } // end of the validateParams function.
  
    // function to get chats.
    let findIssues = () => {
      return new Promise((resolve, reject) => {
        
      
        IssueModel.find({ 'assignedTo': req.query.receiverName })
          .select('-_id -__v')
          .sort('-created')
          .skip(parseInt(req.query.skip) || 0)
          .lean()
          .limit(5)
          .exec((err, result) => {
            if (err) {
              console.log(err)
              logger.error(err.message, 'User Controller: getUsersIssue', 10)
              let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
              reject(apiResponse)
            } else if (check.isEmpty(result)) {
              logger.info('No Issue Found', 'User Controller: getUsersIssue')
              let apiResponse = response.generate(true, 'No Issue Found', 404, null)
              reject(apiResponse)
            } else {
              console.log('issue found and listed.')
  
              // reversing array.
              let reverseResult = result.reverse()
  
              resolve(result)
            }
          })
      })
    } // end of the findChats function.
  
    // making promise call.
    validateParams()
      .then(findIssues)
      .then((result) => {
        let apiResponse = response.generate(false, 'All Issues Listed', 200, result)
        res.send(apiResponse)
      })
      .catch((error) => {
        res.send(error)
      })
  } // end of the getUsersIssue function.

/* Get single user details */
let getSingleIssue = (req, res) => {
    IssueModel.find({ 'issueId': req.params.issueId })
        .select('-password -__v -_id')
        .sort('-created')
        .lean()
        .limit()
        .skip(parseInt(req.query.skip) || 0)
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleIssue', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'User Controller:getSingleIssue')
                let apiResponse = response.generate(true, 'No Issue Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Issue Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single user

/* Get comment details */
let getComments = (req, res) => {
    CommentsModel.find({ 'issueId': req.params.issueId })
        .select('-password -__v -_id')
        .sort('-created')
        .lean()
        .limit()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getComments', 10)
                let apiResponse = response.generate(true, 'Failed To Find Comment Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Comment Found', 'User Controller:getComments')
                let apiResponse = response.generate(true, 'No Comment Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Comment Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get comment details

/* Get comment details */
let getIssueWatcher = (req, res) => {
    Watcher1Model.find({ 'watcher': req.params.receiverName })
        .select('-password -__v -_id')
        .sort('-created')
        .lean()
        .limit()
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getComments', 10)
                let apiResponse = response.generate(true, 'Failed To Find Comment Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Comment Found', 'User Controller:getComments')
                let apiResponse = response.generate(true, 'No Comment Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Comment Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get comment details

/* Get watcher details */
let getWatcher = (req, res) => {

    //issue = req.params.issueId
   // Watcher1Model.distinct({ 'issueId': req.params.issueId })
    Watcher1Model.aggregate([ { $match:{issueId : req.params.issueId}} ,
        { $group : { _id: "$watcher" }}])  
   // .select('-password -__v -_id')
        //.sort('-created')
     //   .lean()
       // .limit(10)
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getWatcher', 10)
                let apiResponse = response.generate(true, 'Failed To Find Watcher Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Watcher Found', 'User Controller:getWatcher')
                let apiResponse = response.generate(true, 'No Watcher Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Watcher Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get watcher details

/* Get single search details */
let getSingleSearch = (req, res) => {
    IssueModel.find( { $or:[{'assignedTo': req.params.issueData } , { 'title': req.params.issueData }
    ,{ 'reporter': req.params.issueData }, { 'status': req.params.issueData }, { 'description': req.params.issueData} ,
    { 'issueId': req.params.issueData }
]}
    )
        .select('-password -__v -_id')
        .sort('-created')
        .lean()
        .limit()
        .skip(parseInt(req.query.skip) || 0)
        .exec((err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'User Controller: getSingleSearch', 10)
                let apiResponse = response.generate(true, 'Failed To Find Issue Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Issue Found', 'User Controller:getSingleSearch')
                let apiResponse = response.generate(true, 'No Issue Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Issue Details Found', 200, result)
                res.send(apiResponse)
            }
        })
}// end get single searach



let deleteUser = (req, res) => {

    UserModel.findOneAndRemove({ 'userId': req.params.userId }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller: deleteUser', 10)
            let apiResponse = response.generate(true, 'Failed To delete user', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: deleteUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the user successfully', 200, result)
            res.send(apiResponse)
        }
    });// end user model find and remove


}// end delete user

let editUser = (req, res) => {

    let options = req.body;
    UserModel.update({ 'userId': req.params.userId }, options).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'User Controller:editUser', 10)
            let apiResponse = response.generate(true, 'Failed To edit user details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No User Found', 'User Controller: editUser')
            let apiResponse = response.generate(true, 'No User Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'User details edited', 200, result)
            res.send(apiResponse)
        }
    });// end user model update


}// end edit user


// start user signup function 

let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end user signup function 

// start of login function 
let loginFunction = (req, res) => {
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}



// end of the login function 


/**
 * function to logout user.
 * auth params: userId.
 */
let logout = (req, res) => {
  AuthModel.findOneAndRemove({userId: req.user.userId}, (err, result) => {
    if (err) {
        console.log(err)
        logger.error(err.message, 'user Controller: logout', 10)
        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
        res.send(apiResponse)
    } else if (check.isEmpty(result)) {
        let apiResponse = response.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
        res.send(apiResponse)
    } else {
        let apiResponse = response.generate(false, 'Logged Out Successfully', 200, null)
        res.send(apiResponse)
    }
  })
} // end of the logout function.



/**
 * function to create the blog.
 */
let createIssue = (req, res) => {
    let issueCreationFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.body.title)|| check.isEmpty(req.body.assignedTo) || check.isEmpty(req.body.description) || check.isEmpty(req.body.reporter) || check.isEmpty(req.body.status)) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let issueId = shortid.generate()

                let newIssue = new IssueModel({

                    issueId: issueId,
                    title: req.body.title,
                    description: req.body.description,

                    reporter : req.body.reporter,
                    assignedTo : req.body.assignedTo,
                    
                    status: req.body.status,
                   
                    created: today,
                    lastModified: today
                }) // end new issue model

                //let tags = (req.body.tags != undefined && req.body.tags != null && req.body.tags != '') ? req.body.tags.split(',') : []
                //newBlog.tags = tags

                newIssue.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in issue creation')
                        resolve(result)
                    }
                }) // end new issue save
            }
        }) // end new issue promise
    } // end create issue function

    // making promise call.
    issueCreationFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Issue Created successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}



/**
 * function to create comment.
 */
let createComment = (req, res) => {
    let commentCreationFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.body.comment)|| check.isEmpty(req.body.commenter) || 
            check.isEmpty(req.body.issueId) ) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let commentId = shortid.generate()

                let newIssue = new CommentsModel({

                    commentId: commentId,
                    comment: req.body.comment,
                    commenter: req.body.commenter,
                    issueId : req.body.issueId,

                    
                   
                    created: today,
                    lastModified: today
                }) // end new issue model

                

                newIssue.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in issue creation')
                        resolve(result)
                    }
                }) // end new issue save
            }
        }) // end new issue promise
    } // end create issue function

    // making promise call.
    commentCreationFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Comment Created successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}


/**
 * function to create watcher.
 */
let createWatcher = (req, res) => {
    let issueWatcherFunction = () => {
        return new Promise((resolve, reject) => {
            console.log(req.body)
            if (check.isEmpty(req.body.watcher)|| 
            check.isEmpty(req.body.issueId) ) {

                console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let watcherId = shortid.generate()

                let newIssue = new Watcher1Model({

                    watcherId: watcherId,
                    watcher: req.body.watcher,
                    
                    issueId : req.body.issueId,

                    
                   
                    created: today,
                    lastModified: today
                }) // end new issue model

                

                newIssue.save((err, result) => {
                    if (err) {
                        console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        console.log('Success in adding watcher')
                        resolve(result)
                    }
                }) // end new watcher save
            }
        }) // end new watcher promise
    } // end create watcher function

    // making promise call.
    issueWatcherFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Watcher added successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            console.log(error)
            res.send(error)
        })
}


/**
 * function to edit blog by admin.
 */
let editIssue = (req, res) => {

    if (check.isEmpty(req.params.issueId)) {

        console.log('issueId should be passed')
        let apiResponse = response.generate(true, 'issueId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        console.log(options);
        IssueModel.update({ 'issueId': req.params.issueId }, options, { multi: true }).exec((err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('Issue Not Found.')
                let apiResponse = response.generate(true, 'Issue Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('Issue Edited Successfully')
                let apiResponse = response.generate(false, 'Issue Edited Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}


module.exports = {

    signUpFunction: signUpFunction,
    getSingleSearch: getSingleSearch,
    getIssueReporter: getIssueReporter,
    getIssueWatcher: getIssueWatcher,
    getAllIssue: getAllIssue,
    createIssue: createIssue,
    createComment: createComment,
    getUsersIssue : getUsersIssue,
    createWatcher : createWatcher,
    editIssue: editIssue,
    deleteUser: deleteUser,
    getSingleUser: getSingleUser,
    getSingleIssue: getSingleIssue,
    getComments : getComments,
    getWatcher : getWatcher,
    loginFunction: loginFunction,
    logout: logout

}// end exports