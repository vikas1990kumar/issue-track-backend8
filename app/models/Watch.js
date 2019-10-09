//importing mongoose module
const mongoose = require('mongoose')

//import schema
const Schema = mongoose.Schema;

let watch1Schema = new Schema (
    {
        
        
        watcherId : {

            type : String,
            default: '',
            unique : true
            
        },
        

      issueId :{
        type : String,
        default :''
       },

       watcher : {
          type : String,
          default : ''
          

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

mongoose.model('Watch1', watch1Schema);