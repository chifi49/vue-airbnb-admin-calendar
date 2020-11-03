const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));
app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const daynames = ['Sun','Mon','Tue','Wed','Thu','Sat']
function getWeekNumber(d) {
    d = new Date(+d) // Copy date so don't modify original.
    d.setHours(0, 0, 0, 0) // Reset hours.
    d.setDate(d.getDate() + 4 - (d.getDay() || 7)) // Set to nearest Thursday: current date + 4 - current day number and make Sunday's day number 7
    var yearStart = new Date(d.getFullYear(), 0, 1) // Get first day of year
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7) // Calculate full weeks to nearest Thursday
    return weekNo // Return week number
  }

app.get('/month/:monthindex/year/:yearindex', async (req, res)=>{
    var monthindex = parseInt( req.params.monthindex );
    var yearindex = parseInt( req.params.yearindex );
    var totaldays =  new Date(yearindex, monthindex+1, 0).getDate()
    var days = [];
    for(var i=1;i<=totaldays;i++){
        var cd = new Date(yearindex,monthindex,i);
        var week = getWeekNumber(cd);
        days.push({
            day: i,
            week: week,
            month: monthindex,
            price: '<span>&euro; '+parseInt(Math.random(0,10)*50)+'</span>',
            bookings: Math.floor(Math.random(0,10)+1),
            year: yearindex
        })
    }
    res.json({days: days});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})