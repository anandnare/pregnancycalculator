function calculateDueDate() {
    let date = document.getElementById('date').value;
    let month = document.getElementById('month').value;
    let year = document.getElementById('year').value;

    if (date && month && year) {
        let lastPeriodDate = new Date(`${year}-${month}-${date}`);
        
        // Calculate due date (280 days = 40 weeks from last period)
        let dueDate = new Date(lastPeriodDate.getTime() + (280 * 24 * 60 * 60 * 1000));

        let resultText = `Your estimated due date is: ${dueDate.toDateString()}`;
        document.getElementById('result').innerText = resultText;
    } else {
        document.getElementById('result').innerText = 'Please enter a valid date.';
    }
}

