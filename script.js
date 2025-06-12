function calc() {
  // number of weekdays
  const weekdays = new Array(7).fill(0);
  // user inputs of dates
  const begin_date = new Date(document.getElementById('begin_date').value);
  const end_date = new Date(document.getElementById('end_date').value);
  const weekday_names = [
    'Monday // 周一',
    'Tuesday // 周二',
    'Wednesday // 周三',
    'Thursday // 周四',
    'Friday // 周五',
    'Saturday // 周六',
    'Sunday // 周日',
  ];
  // user inputs of hours each day
  const weekday_hrs = [
    document.getElementById('monday_hr').value,
    document.getElementById('tuesday_hr').value,
    document.getElementById('wednesday_hr').value,
    document.getElementById('thursday_hr').value,
    document.getElementById('friday_hr').value,
    document.getElementById('saturday_hr').value,
    document.getElementById('sunday_hr').value,
  ];
  
  // parse through each day and count weekdays
  for (let d = new Date(begin_date); d <= end_date; d.setDate(d.getDate() + 1)) {
    weekdays[d.getDay()]++;
  }
  
  // display number of weekdays
  let result_text = '';
  weekdays.forEach((count, index) => {
    result_text += `${weekday_names[index]}: ${count}<br>`;
  });
  document.getElementById('detail').innerHTML = result_text;

  // display pay period
  if (!isNaN(begin_date)) {
    const displayBegin = new Date(begin_date);
    displayBegin.setDate(displayBegin.getDate() + 1);
    var begin = displayBegin.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (!isNaN(end_date)) {
    const displayEnd = new Date(end_date);
    displayEnd.setDate(displayEnd.getDate() + 1);
    var end = displayEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  document.getElementById('pay_period').innerHTML = 'Pay Period // 工资周期: ' + begin + ' - ' + end;

  // calculate total hours; number of weekday * hour of weekday
  let total_hrs = 0;
  for (let i = 0; i <= 6; i++) {
    let result = weekdays[i] * weekday_hrs[i];
    total_hrs += result;
  }
  document.getElementById('hours').innerHTML = 'Total Hours // 总工时: ' + total_hrs;

  // calculate total wages; total hours * wage
  var total_wages = total_hrs * document.getElementById('wage').value;
  document.getElementById('wages').innerHTML = 'Total Wages // 总工资: ' + total_wages;
}

// limit hour input
function limit(input) {
  const warning = document.getElementById("warning");
  if (input.value > 24 || input.value < 0) {
    warning.style.opacity = 1;
  } else {
    warning.style.opacity = 0;
  }
}
