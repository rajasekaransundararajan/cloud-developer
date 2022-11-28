import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  let fetchedImages : Array<string> = [];
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage/", async ( request, response ) => {
    let {image_URL} = request.query;
    if ( !image_URL ) {
      return response.status(400)
                .send(`image url is required`);
    }
    let fname = '';

    try{
    const fetchImage = filterImageFromURL(image_URL);
    fetchImage.then(value => {
      fname = value;
      fetchedImages.push(fname);
      response.status(200).sendFile(fname, error => {
        if (error) {
            console.log(error);
            response.sendStatus(500);
        }
        const deleteImages = deleteLocalFiles(fetchedImages);
      deleteImages.then(value => {
        console.log("File deleted succesffully")
        fetchedImages = [];
      });
     });
    })

    fetchImage.catch(error => {
      return res.send(error);
    })
    
  } catch (error) {
    if (error) {
        return error.message
    }
  }
  finally{
  }

    
  } );

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();