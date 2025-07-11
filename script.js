function getDateFromInput(id) {
	const value = document.getElementById(id).value;
	const parts = value.split("-");
	return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

// get hours for each weekday
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

// count how many times each weekday appears
function countWeekdays(begin_date, end_date) {
	const weekdays = new Array(7).fill(0);
	// parse through each day and count weekdays
	for (let d = new Date(begin_date); d <= end_date; d.setDate(d.getDate() + 1)) {
		weekdays[d.getDay()]++;
	}
	return weekdays;
}

//format date for display
function formatDate(date) {
	const display = new Date(date);
	display.setDate(display.getDate());
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

function calcOvertime() {
	const begin_date = getDateFromInput('begin_date');
	const end_date = getDateFromInput('end_date');
	const week_start = parseInt(document.getElementById('week_start').value);

	const error_box = document.getElementById('overtime_error');
	const result_box = document.getElementById('overtime_result_box');
	const placeholder = document.getElementById('overtime_placeholder');
	error_box.textContent = ''; 

	if (isNaN(begin_date.getTime()) || isNaN(end_date.getTime())) {
		error_box.textContent = 'Please select both a begin and end date. // 请选择开始和结束日期';
		result_box.innerHTML = '<p id="overtime_placeholder" class="placeholder">Result goes here // 结果显示在这里</p>';
		document.getElementById('copy_button').style.display = 'none';

		return;
	}

	if (begin_date > end_date) {
		error_box.textContent = 'Begin date cannot be after end date. // 开始日期不能晚于结束日期';
		result_box.innerHTML = '<p id="overtime_placeholder" class="placeholder">Result goes here // 结果显示在这里</p>';
		document.getElementById('copy_button').style.display = 'none';

		return;
	}

	const standard_work_week_hour = parseFloat(document.getElementById('standard_work_week_hour').value);
	const overtime_multiplier = parseFloat(document.getElementById('overtime_multiplier').value);
	const hourly_wage = parseFloat(document.getElementById('wage').value);
	const weekday_hours = getWeekdayHours().map(Number);
	
	if (isNaN(hourly_wage) || hourly_wage <= 0) {
		error_box.textContent = 'Please enter a hourly wage. // 请输入时薪';
		result_box.innerHTML = '<p id="overtime_placeholder" class="placeholder">Result goes here // 结果显示在这里</p>';
		document.getElementById('copy_button').style.display = 'none';
		
		return;
	}

	let total_hours = 0;
	let total_pay = 0;

	let result_text = ``;

	let week_number = 1;

	let current_start = new Date(begin_date);
	while (current_start.getDay() !== week_start) {
		current_start.setDate(current_start.getDate() - 1);
	}
	
	while (current_start <= end_date) {
		const current_end = new Date(current_start);
		current_end.setDate(current_start.getDate() + 6); // one full week

		const clamped_start = new Date(Math.max(current_start.getTime(), begin_date.getTime()));
		const clamped_end = new Date(Math.min(current_end.getTime(), end_date.getTime()));

		let week_hours = 0;
		for (let d = new Date(clamped_start); d <= clamped_end; d.setDate(d.getDate() + 1)) {
			const day_index = d.getDay();
			week_hours += weekday_hours[day_index] || 0;
		}
		total_hours += week_hours;

		let breakdown = `Week ${week_number} (${formatDate(clamped_start)} - ${formatDate(clamped_end)}): \n`;
		breakdown += `  Hours this week: ${week_hours} hr\n`;
		
		let week_pay = 0;

		if (week_hours > standard_work_week_hour) {
			const base_hours = standard_work_week_hour;
			const overtime_hours = week_hours - standard_work_week_hour;
			const base_pay = base_hours * hourly_wage;
			const overtime_pay = overtime_hours * hourly_wage * overtime_multiplier;
			week_pay = base_pay + overtime_pay;
			breakdown += `  ${base_hours} hr × $${hourly_wage} + ${overtime_hours} hr × $${hourly_wage} × ${overtime_multiplier} = $${week_pay.toFixed(2)}\n`;
		} else {
			week_pay = week_hours * hourly_wage;
			breakdown += `  ${week_hours} hr × $${hourly_wage} = $${week_pay.toFixed(2)}\n`;
		}

		total_pay += week_pay;
		result_text += breakdown + '\n';

		current_start.setDate(current_start.getDate() + 7); // move to next week
		week_number++;
	}


	result_text = `Pay Period // 工资周期: ${formatDate(begin_date)} - ${formatDate(end_date)}\n` +
				`Total Pay // 总工资: $${total_pay.toFixed(2)}\n` + `Total Hours // 总工时: ${total_hours} hr\n\n` + result_text;
	result_box.innerHTML = `<pre>${result_text}</pre>`;
	document.getElementById('copy_button').style.display = 'block';
	document.getElementById("overtime_result_box").innerHTML = `<pre>${result_text}</pre>`;
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

function toggleMode() {
	const isChecked = document.getElementById('toggle_mode').checked;
	document.getElementById('default_view').style.display = isChecked ? 'none' : 'block';
	document.getElementById('overtime_view').style.display = isChecked ? 'block' : 'none';
}

window.onload = function () {
	toggleMode();
};

function copyOvertimeResult() {
	const result_text = document.querySelector('#overtime_result_box pre');
	if (!result_text) return;

	navigator.clipboard.writeText(result_text.textContent)
		.then(() => {
			alert('Result copied to clipboard! // 结果已复制');
		})
		.catch(err => {
			alert('Failed to copy result. // 复制失败');
		console.error(err);
	});
}

