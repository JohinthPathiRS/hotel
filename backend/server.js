const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const cors = require('cors'); // Import cors pa

require('dotenv').config();
//const { GenerativeLanguageClient } = require('@google-ai/generativelanguage');
//const client = new GenerativeLanguageClient({ apiKey: process.env.GOOGLE_API_KEY });

let chatSession;

require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'login_app'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});


function generateSecretKey() {
    return crypto.randomBytes(64).toString('hex');
}


const SECRET_KEY = generateSecretKey();


app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error registering user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

app.delete('/DeleteRoomByName', (req, res) => {
    const roomName = req.query.roomName;
    const sql = 'DELETE FROM rooms WHERE roomName = ?';
    db.query(sql, [roomName], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting room', error: err });
        }
        res.status(200).json({ message: 'Room deleted successfully', result: true });
    });
});

app.post('/chat', async (req, res) => {
    try {
        const userPrompt = req.body.userPrompt;

        // Prepare the request body for the generative language API
        const requestBody = {
            prompt: userPrompt,
            // You might need to adjust the request body based on the actual API documentation
        };

        // Send user's message to the generative language model and get the response
        const response = await client.generateContent(requestBody);

        // Return the response from the generative language model
        res.json({ response: response.data.text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }
    
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    });
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    db.query('UPDATE users SET ? WHERE id = ?', [updatedUser, userId], (error, results) => {
        if (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ result: false, message: 'Failed to update user' });
        } else {
            res.json({ result: true, message: 'User updated successfully' });
        }
    });
});
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', userId, (error, results) => {
        if (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ result: false, message: 'Failed to delete user' });
        } else {
            res.json({ result: true, message: 'User deleted successfully' });
        }
    });
});

// In your Express server
app.delete('/DeleteRoomById/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const sql = 'DELETE FROM rooms WHERE roomId = ?';
    db.query(sql, [roomId], (err, result) => {
        if (err) {
            console.error('Error deleting room:', err);
            return res.status(500).json({ message: 'An error occurred while deleting the room.', error: err });
        }
        res.status(200).json({ result: true, message: 'Room deleted successfully.' });
    });
});


app.post('/CreateBooking', (req, res) => {
    const bookingObj = req.body;
    const { name, mobileNo, email, city, address, roomId, bookingFromDate, bookingToDate, bookingRate, naration } = bookingObj;

    // Insert booking information into the bookings table
    db.query('INSERT INTO bookings (name, mobileNo, email, city, address, roomId, bookingFromDate, bookingToDate, bookingRate, naration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, mobileNo, email, city, address, roomId, bookingFromDate, bookingToDate, bookingRate, naration], 
    (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating booking', error: err });
        }

        const bookingId = result.insertId;
        
        res.status(200).json({ message: 'Booking created successfully', bookingId: bookingId });
    });
});
app.get('/GetAllBookings', (req, res) => {
    const sql = 'SELECT * FROM bookings';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching bookings', error: err });
        }
        res.status(200).json(results);
    });
});



app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;
    const insertBookingQuery = 'INSERT INTO bookings SET ?';
    connection.query(insertBookingQuery, bookingData, (err, result) => {
      if (err) {
        console.error('Error saving booking:', err);
        res.status(500).send('Error saving booking');
      } else {
        res.status(201).send(result);
      }
    });
  });

app.get('/GetAllRooms', (req, res) => {
    const sql = 'SELECT * FROM rooms';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching rooms' });
        }
        res.status(200).json({ message: '', result: true, data: results });
    });
});


app.post('/AddUpdateBulkRooms', (req, res) => {
    const rooms = req.body;
    const values = rooms.map(room => [room.roomId, room.roomName, room.isAcAvailable, room.roomCapacity, room.isActive, room.roomTariff, room.extensionNo]);

    const sql = `
        INSERT INTO rooms (roomId, roomName, isAcAvailable, roomCapacity, isActive, roomTariff, extensionNo)
        VALUES ?
        ON DUPLICATE KEY UPDATE
        roomName = VALUES(roomName),
        isAcAvailable = VALUES(isAcAvailable),
        roomCapacity = VALUES(roomCapacity),
        isActive = VALUES(isActive),
        roomTariff = VALUES(roomTariff),
        extensionNo = VALUES(extensionNo)
    `;
    
    db.query(sql, [values], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating rooms' });
        }
        res.status(200).json({ message: 'Rooms updated successfully', results });
    });
});
app.get('/selectusers', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error getting users: ', err);
            res.status(500).send('Error getting users from database');
            return;
        }
        res.json({ data: results });
    });
});
// Add or update a user
app.post('/users', (req, res) => {
    const newUser = req.body;
    db.query('INSERT INTO users SET ?', newUser, (error, results) => {
        if (error) {
            console.error('Error adding user:', error);
            let errorMessage = 'An error occurred while adding the user.';

            // Check for specific error types
            if (error.code === 'ER_DUP_ENTRY') {
                errorMessage = 'A user with the given username already exists.';
            } else if (error.code === 'ER_BAD_NULL_ERROR') {
                errorMessage = 'A required field is missing.';
            } else if (error.code === 'ER_PARSE_ERROR') {
                errorMessage = 'There was a problem with the query syntax.';
            }

            res.status(500).json({ error: errorMessage, details: error });
        } else {
            res.json({ result: true, message: 'User added successfully' });
        }
    });
});


  app.delete('/deleteusers/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM user WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while deleting the user.', error: err });
      }
      res.status(200).json({ result: true, message: 'User deleted successfully.' });
    });
  });
  app.post('/chat', async (req, res) => {
    const userInput = req.body.message;
  
    const request = {
      session: dialogflowClient.sessionPath(projectId, sessionId),
      queryInput: {
        text: {
          text: userInput,
          languageCode: 'en-US', // Adjust language code if needed
        },
      },
    };
  
    try {
      const response = await dialogflowClient.detectIntent(request);
      const fulfillmentText = response.queryResult.fulfillmentText;
  
      res.json({ message: fulfillmentText });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating response' });
    }
  });
  

  


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Secret Key: ${SECRET_KEY}`);
});
