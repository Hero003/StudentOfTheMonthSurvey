class School {
  constructor() {
    this.teachers = new Map();
    this.classes = new Map();
    this.loadSampleData();
  }

  loadSampleData() {
    this.addTeacher('teacher1', 'pass1', 'John Teacher', ['CBSE 8B']);

    this.addClass('CBSE 8B', [
      new Student('Aradhay Bhardwaj', 'A'),
      new Student('Adit Tejaskumar Maniar', 'B'),
      new Student('Anagha Rao', 'C'),
      new Student('Ashvanth Karthikeyan', 'D'),
      new Student('Ayansh Gupta', 'E'),
      new Student('Charvik Reddy Pulluru', 'F'),
      new Student('Debabrata Roy', 'G'),
      new Student('Diya Praveen', 'H'),
      new Student('Harsha Harish Kumar', 'I'),
      new Student('Harshita Harish Kumar', 'J'),
      new Student('Hriday Hari', 'K'),
      new Student('Ishanvi Dhaka', 'L'),
      new Student('Keerthanaa Ravi', 'M'),
      new Student('Mirthika Shanmugakumar', 'N'),
      new Student('Misheeta Shukla', 'O'),
      new Student('Mitansh Pandya', 'P'),
      new Student('Nia Samuel', 'Q'),
      new Student('Nishita Dixit', 'R'),
      new Student('Raahithya Sanghvi', 'S'),
      new Student('Revanth Gadde', 'T'),
      new Student('Rithvika Jayavardhan', 'U'),
      new Student('Roel Prince Kumar', 'V'),
      new Student('Samriddhi Singh', 'W'),
      new Student('Satwik Mohanty', 'X'),
      new Student('Shreya Rajiv Menon', 'Y'),
      new Student('Shyam Venkatanarayan Paku', 'Z'),
      new Student('Tulip Khadgarai', 'AA'),
      new Student('Vaishnavi Lakshmi Narayanan', 'AB'),
      new Student('Vihaan Garg', 'AC'),
      new Student('Vivaan Mishra', 'AD'),
      new Student('Yashwardhan Pratap Singh', 'AE')
    ]);
  }

  addTeacher(username, password, name, classes) {
    this.teachers.set(username, new Teacher(username, password, name, classes));
  }

  addClass(className, students) {
    this.classes.set(className, students);
  }

  addStudentToClass(className, student) {
    if (!this.classes.has(className)) {
      this.classes.set(className, []);
    }
    this.classes.get(className).push(student);
  }

  getTeacher(username) {
    return this.teachers.get(username);
  }

  getClassStudents(className) {
    return this.classes.get(className) || [];
  }

  validateTeacher(username, password) {
    const teacher = this.teachers.get(username);
    return teacher && teacher.password === password ? teacher : null;
  }
}

class Teacher {
  constructor(username, password, name, classes) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.classes = classes;
  }
}

class Student {
  constructor(name, rollNo) {
    this.name = name;
    this.rollNo = rollNo;
  }
}

const school = new School();

window.onload = function() {
  const loggedInTeacher = localStorage.getItem('currentTeacher');
  if (loggedInTeacher) {
    showDashboard(JSON.parse(loggedInTeacher));
    setInterval(() => {
      localStorage.setItem('surveyProgress', '{}');
      const bars = document.querySelectorAll('.progress-bar');
      bars.forEach(bar => {
        bar.className = 'progress-bar';
        bar.style.width = '0%';
      });
    }, 1800000);
  }
};

function login(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const teacher = school.validateTeacher(username, password);
  if (teacher) {
    localStorage.setItem('currentTeacher', JSON.stringify(teacher));
    showDashboard(teacher);
  } else {
    alert('Invalid credentials');
  }
  return false;
}

function showDashboard(teacher) {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('dashboardContainer').style.display = 'block';
  document.getElementById('teacherName').textContent = teacher.name;

  const studentTablesDiv = document.getElementById('studentTables');
  studentTablesDiv.innerHTML = '';

  const progressStatus = JSON.parse(localStorage.getItem('surveyProgress') || '{}');

  teacher.classes.forEach(className => {
    const classStudents = school.getClassStudents(className);
    const tableHtml = `
      <h2>${className}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll no</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          ${classStudents.map(student => {
            const key = `${teacher.username}_${student.name}`;
            const submissionCount = progressStatus[key] || 0;
            const colorClass = submissionCount === 1 ? 'yellow' : submissionCount === 2 ? 'blue' : submissionCount >= 3 ? 'green' : '';
            const width = Math.min(submissionCount * 33.33, 100);

            return `
              <tr>
                <td><a href="Survey.html?name=${encodeURIComponent(student.name)}&rollNo=${student.rollNo}&class=${encodeURIComponent(className)}">${student.name}</a></td>
                <td>${student.rollNo}</td>
                <td>
                  <div class="progress-bar-container">
                    <div class="progress-bar ${colorClass}" style="width: ${width}%" id="progress_${key}"></div>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
    studentTablesDiv.innerHTML += tableHtml;
  });
}

function logout() {
  localStorage.removeItem('currentTeacher');
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('dashboardContainer').style.display = 'none';
  document.getElementById('loginForm').reset();
}
