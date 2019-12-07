# liri-node-app

This LIRI node app will return movie, song, or concert information based on a command line prompt. The user is asked (via inquirer in the command line) whether they want to search for a movie, a song, or upcoming concerts by a specific artist. They are then asked for an input, which will serve as the search term for the relevant API query.

Using the axios and omdb APIs, the information is returned in the command line, and logged to a log.txt file in the same format. The information in log.txt is not overwritten, keeping an ordered log of all data returned from the API

MomentJS is used to display the concert times.

There are four options presented to the user: movie, song, concert and random.

The fromFile function is called if the user selects "random" and uses information from an external file (random.txt) to make the API call. A switch statement inside the fromFile function checks whether that information is for a movie, song, or concert search. This allows for changes to the random.txt file without breaking the code.

This app is useful because it quickly returns information for the song, movie, or artist that a user wants to know. It presents it in a readable and user-friendly way, and the command is selected using an inquirer list, as opposed to argv, which is more user-friendly.
