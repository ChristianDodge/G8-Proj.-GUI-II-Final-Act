require('dotenv').config();
console.log('TMDB API Key:', process.env.TMDB_ACCESS_TOKEN); 

const express = require('express'); 
const axios = require('axios'); 
const fs = require('fs'); 
const path = require('path'); 

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // to parse JSON request bodies


function read() {
    return new Promise((resolve, reject) => {
        fs.readFile("data.json", "utf8", (err, data) => {  
            if (err) reject(err); // reject promise if there's an error
            resolve(JSON.parse(data)); // parse and return JSON data
        });
    });
}

function write(data, field, type) { //write function which takes a data value (intended use is ints representing the movie ids), a field (seen/saved), and a type (add/remove)
    read().then(info => {
        switch(type) {
            case "remove":
                if (field === "seen") { //if we want to remove from seen
                    const index = info.seen.indexOf(data); //find where the data we want to remove is
                    if (index > -1) { //if we find it
                        info.seen.splice(index, 1); //remove it
                    }
                } else if (field === "saved") {//if we want to remove from saved do the same thing
                    const index = info.saved.indexOf(data);
                    if (index>-1) {
                        info.saved.splice(index, 1); 
                    }
                }
                else{
                    //invalid field
                }
                break;
            case "add":
                if(field == "seen") { //if we want to add to seen
                                if(info.seen.includes(data)) { //check if its already in seen, there are no duplicate ids, so we shouldnt add an id twice
                                    //already in seen
                                } else { //if its not already in seen
                                    info.seen.push(data); //push it
                                }
                            } else if(field == "saved") { //same deal with saved
                                if(info.saved.includes(data)) {
                                    //already in seen
                                } else {
                                    info.saved.push(data);
                                }
                            } else{
                                //invalid field
                            }
                break;
        }

        fs.writeFile("data.json", JSON.stringify(info, null, 2), err => { //we must turn the info into a string and set data.json's contents to that.
            if (err) throw err; });
    }).catch(err => {
        console.error("Error reading data:", err);
    });
}


app.get('/movies', async (req, res) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie?year=2019&page=1', {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
            }
        });

        /* example read and write operations
        let readData = read();

        console.log("before" + readData.seen);

        write(6, "seen", "remove");

        readData = read();

        console.log("after" + readData.seen);

        write(10, "seen", "add");

        readData = read();

        console.log("after" + readData.seen);
        */

        let readData = await read();  // read data.json to get "seen" movies
        let movies = [];  // created empty array to store movie data
        let i = 0; //iterator variable


        
        while (movies.length < 10 && i < response.data.results.length) {
            if (!readData.seen.includes(response.data.results[i].id)) {  // Ensure movie isn't in the seen list
                const movie = {
                    // sorted the raw movie data for front end
                    title: response.data.results[i].title,
                    description: response.data.results[i].overview,
                    image: `https://image.tmdb.org/t/p/w500${response.data.results[i].poster_path}`,
                    rating: response.data.results[i].vote_average,
                    duration: "N/A"  // Placeholder for duration (could be updated later)
                };
                movies.push(movie);  // Add movie to the list
            }
            i++;
        }

        res.json(movies); // Send the movie list as JSON response
        

    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ error: error.message }); // Handle API errors gracefully
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log server URL
});
