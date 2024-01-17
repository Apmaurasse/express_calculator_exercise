const express = require('express');

const ExpressError = require("./expressError")

const app = express();

app.use(express.json());



app.get('/', (req, res) =>{
    res.send("HOMEPAGE!")
})



app.get('/mean', (req, res, next) => {
    
    try{
const nums = req.query.nums;

if (!nums || nums.trim() === '') {
    throw new ExpressError("nums parameter is required and cannot be empty.", 400)
}

const numbers = nums.split(',').map(num => Number(num.trim()));

if (numbers.some(isNaN) || !numbers.every(isFinite)) {
    throw new ExpressError("Invalid numbers are provided.", 400);
}

const mean = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;

res.json({
  operation: 'mean',
  value: mean
});
} catch (e) {
    next(e)
}

});


app.get('/median', (req, res, next) => {
    try {
        const nums = req.query.nums;

        if (!nums || nums.trim() === '') {
            throw new ExpressError("nums parameter is required and cannot be empty.", 400);
        }

        const numbers = nums.split(',').map(num => parseFloat(num.trim()));

        if (numbers.some(isNaN) || !numbers.every(isFinite)) {
            throw new ExpressError("Invalid numbers are provided.", 400);
        }

        const sortedNumbers = numbers.sort((a, b) => a - b);
        const length = sortedNumbers.length;

        if (length % 2 === 0) {
            const middle1 = sortedNumbers[length / 2 - 1];
            const middle2 = sortedNumbers[length / 2];
            const median = (middle1 + middle2) / 2;
            res.json({
                operation: 'median',
                value: median
            });
        } else {
            const median = sortedNumbers[Math.floor(length / 2)];
            res.json({
                operation: 'median',
                value: median
            });
        }
    } catch (e) {
        next(e);
    }
});


app.get('/mode', (req, res, next) => {
    try {
        const nums = req.query.nums;

        if (!nums || nums.trim() === '') {
            throw new ExpressError("nums parameter is required and cannot be empty.", 400);
        }

        const numbers = nums.split(',').map(num => parseFloat(num.trim()));

        if (numbers.some(isNaN) || !numbers.every(isFinite)) {
            throw new ExpressError("Invalid numbers are provided.", 400);
        }

        // Create an object to store the frequency of each number
        const frequency = {};
      
        // Loop through the numbers and count their occurrences
        numbers.forEach(number => {
          frequency[number] = (frequency[number] || 0) + 1;
        });
      
        // Find the number with the highest frequency
        let modes = [];
        let maxFrequency = 0;

        for (const number in frequency) {
            if (frequency[number] === maxFrequency) {
                modes.push(number);
        } else if (frequency[number] > maxFrequency) {
            maxFrequency = frequency[number];
            modes = [number];
        }
        }     
        res.json({
            operation: 'mode',
            value: modes
        });
        
    } catch (e) {
        next(e);
    }
});




app.use((req, res, next) =>{
    const e = new ExpressError("Page Not Found", 404)
    next(e)
})

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    });
});



app.listen(3000, () => {
    console.log('Server running on port 3000');
});