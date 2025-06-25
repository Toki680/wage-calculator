function getDateFromInput(id) {
	return new Date(document.getElementById(id).value);
}

function getWeekdayHours() {
	return [
		document.getElementById('monday_hr').value,
		document.getElementById('tuesday_hr').value,
		document.getElementById('wednesday_hr').value,
		document.getElementById('thursday_hr').value,
		document.getElementById('friday_hr').value,
		document.getElementById('saturday_hr').value,
		document.getElementById('sunday_hr').value,
  	];
}

function countWeekdays(begin_date, end_date) {
	const weekdays = new Array(7).fill(0);
	// parse through each day and count weekdays
	for (let d = new Date(begin_date); d <= end_date; d.setDate(d.getDate() + 1)) {
		weekdays[d.getDay()]++;
	}
	return weekdays;
}

function formatDate(date) {
	const display = new Date(date);
	display.setDate(display.getDate() + 1);
	return display.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


function displayResults(weekdays, weekday_names, weekday_hrs, begin_date, end_date) {
  // display number of weekdays
  let result_text = '';
  weekdays.forEach((count, index) => {
    result_text += `${weekday_names[index]}: ${count}<br>`;
  });
  document.getElementById('detail').innerHTML = result_text;

  // display pay period
  const begin = formatDate(begin_date);
  const end = formatDate(end_date);
  document.getElementById("pay_period").innerHTML = `Pay Period // 工资周期: ${begin} - ${end}`;
  document.getElementById('pay_period').innerHTML = `Pay Period // 工资周期: ${begin} - ${end}`;
 
  let total_hrs = 0;
  for (let i = 0; i <= 6; i++) {
    let result = weekdays[i] * weekday_hrs[i];
	total_hrs += result;
   }
  document.getElementById('hours').innerHTML = `Total Hours // 总工时: ${total_hrs}`;

  // calculate total wages; total hours * wage
  var total_wages = total_hrs * document.getElementById('wage').value;
  document.getElementById('wages').innerHTML = `Total Wages // 总工资: ${total_wages}`;
}

function calc() { 
  // user inputs of dates
  const begin_date = getDateFromInput('begin_date');
  const end_date = getDateFromInput('end_date');
  
  const weekday_names = [
    'Monday // 周一',
    'Tuesday // 周二',
    'Wednesday // 周三',
    'Thursday // 周四',
    'Friday // 周五',
    'Saturday // 周六',
    'Sunday // 周日',
  ];
  const weekday_hrs = getWeekdayHours();
  const weekdays = countWeekdays(begin_date, end_date);
  displayResults(weekdays, weekday_names, weekday_hrs, begin_date, end_date);
}

// limit hour input
function limitHourInput(input) {
  const warning = document.getElementById('warning');
  if (input.value > 24 || input.value < 0) {
    warning.style.opacity = 1;
  } else {
    warning.style.opacity = 0;
  }
}
