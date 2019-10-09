//importing mongoose module
const mongoose = require('mongoose')

//import schema
const Schema = mongoose.Schema;

let commentsSchema = new Schema (
    {
        
        commenter : {
            type : String,
            default :''
        },
        
        comment :{
            type : String,
            default :''
      },

      issueId :{
        type : String,
        default :''
       },

        created : {
            type : Date,
            default :Date.now
        },
        lastModified : {
            type : Date,
            default :Date.now
        }
        
        
    }
)

mongoose.model('Comments', commentsSchema);