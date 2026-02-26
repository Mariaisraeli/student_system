// Student Management System

// Store students in array
let students = [];

// Initialize with sample data
function initializeSampleData() {
    if (students.length === 0) {
        students = [
            {
                id: "S001",
                name: "John Doe",
                age: 15,
                gender: "Male",
                form: 1,
                performance: [
                    {
                        form: 1,
                        subjects: {
                            math: 75,
                            english: 80,
                            science: 70,
                            social: 85
                        }
                    }
                ]
            },
            {
                id: "S002",
                name: "Jane Smith",
                age: 16,
                gender: "Female",
                form: 2,
                performance: [
                    {
                        form: 1,
                        subjects: {
                            math: 85,
                            english: 90,
                            science: 88,
                            social: 92
                        }
                    },
                    {
                        form: 2,
                        subjects: {
                            math: 78,
                            english: 85,
                            science: 82,
                            social: 88
                        }
                    }
                ]
            }
        ];
    }
}

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    displayStudents();
    
    // Student Registration Form
    const studentForm = document.getElementById('studentForm');
    studentForm.addEventListener('submit', handleStudentRegistration);
    
    // Performance Modal
    const modal = document.getElementById('performanceModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // Performance Form
    const performanceForm = document.getElementById('performanceForm');
    performanceForm.addEventListener('submit', handlePerformanceSubmission);
});

// Handle Student Registration
function handleStudentRegistration(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('fullName').value.trim();
    const id = document.getElementById('studentId').value.trim();
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const form = parseInt(document.getElementById('formLevel').value);
    
    // Validate inputs
    if (!validateStudentInput(name, id, gender, age, form)) {
        return;
    }
    
    // Check for unique ID
    if (students.some(student => student.id === id)) {
        showAlert('Student ID must be unique!', 'error');
        return;
    }
    
    // Create student object
    const newStudent = {
        id: id,
        name: name,
        age: age,
        gender: gender,
        form: form,
        performance: []
    };
    
    // Add to students array
    students.push(newStudent);
    
    // Clear form
    document.getElementById('studentForm').reset();
    
    // Refresh display
    displayStudents();
    
    // Show success message
    showAlert('Student registered successfully!', 'success');
}

// Validate Student Input
function validateStudentInput(name, id, gender, age, form) {
    if (!name || !id || !gender || !age || !form) {
        showAlert('All fields are required!', 'error');
        return false;
    }
    
    if (age < 10 || age > 20) {
        showAlert('Age must be between 10 and 20!', 'error');
        return false;
    }
    
    if (form < 1 || form > 4) {
        showAlert('Form must be between 1 and 4!', 'error');
        return false;
    }
    
    return true;
}

// Display Students in Table
function displayStudents() {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        // Calculate average score
        const averageScore = calculateStudentAverage(student);
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>Form ${student.form}</td>
            <td>${averageScore}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewStudent('${student.id}')">View</button>
                    <button class="action-btn performance-btn" onclick="openPerformanceModal('${student.id}')">Performance</button>
                    <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Calculate Student Average Score
function calculateStudentAverage(student) {
    if (!student.performance || student.performance.length === 0) {
        return 'N/A';
    }
    
    // Get latest performance record
    const latestPerformance = student.performance[student.performance.length - 1];
    const scores = Object.values(latestPerformance.subjects);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return average.toFixed(2) + '%';
}

// View Student Details
window.viewStudent = function(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const studentInfo = `
        📋 Student Details:
        Name: ${student.name}
        ID: ${student.id}
        Age: ${student.age}
        Gender: ${student.gender}
        Current Form: Form ${student.form}
        Total Performance Records: ${student.performance.length}
    `;
    
    alert(studentInfo);
}

// Delete Student
window.deleteStudent = function(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== studentId);
        displayStudents();
        showAlert('Student deleted successfully!', 'success');
    }
}

// Open Performance Modal
let currentStudentId = null;

window.openPerformanceModal = function(studentId) {
    currentStudentId = studentId;
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    const modal = document.getElementById('performanceModal');
    const studentInfo = document.getElementById('performanceStudentInfo');
    
    studentInfo.innerHTML = `
        <h3>Student: ${student.name} (${student.id})</h3>
        <p>Current Form: Form ${student.form}</p>
    `;
    
    // Display performance history
    displayPerformanceHistory(student);
    
    // Clear form
    document.getElementById('performanceForm').reset();
    
    modal.style.display = 'block';
}

// Display Performance History
function displayPerformanceHistory(student) {
    const tableBody = document.getElementById('performanceTableBody');
    tableBody.innerHTML = '';
    
    if (!student.performance || student.performance.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No performance records yet</td></tr>';
        return;
    }
    
    student.performance.forEach(record => {
        const row = document.createElement('tr');
        const scores = Object.values(record.subjects);
        const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
        
        row.innerHTML = `
            <td>Form ${record.form}</td>
            <td>${record.subjects.math}</td>
            <td>${record.subjects.english}</td>
            <td>${record.subjects.science}</td>
            <td>${record.subjects.social}</td>
            <td>${average}%</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Handle Performance Submission
function handlePerformanceSubmission(e) {
    e.preventDefault();
    
    if (!currentStudentId) return;
    
    const student = students.find(s => s.id === currentStudentId);
    if (!student) return;
    
    // Get form values
    const form = parseInt(document.getElementById('performanceForm').value);
    const math = parseInt(document.getElementById('math').value);
    const english = parseInt(document.getElementById('english').value);
    const science = parseInt(document.getElementById('science').value);
    const social = parseInt(document.getElementById('social').value);
    
    // Validate scores
    if (!validateScores(math, english, science, social)) {
        return;
    }
    
    // Check if performance for this form already exists
    const existingIndex = student.performance.findIndex(p => p.form === form);
    
    const performanceRecord = {
        form: form,
        subjects: {
            math: math,
            english: english,
            science: science,
            social: social
        }
    };
    
    if (existingIndex !== -1) {
        // Update existing record
        student.performance[existingIndex] = performanceRecord;
        showAlert('Performance updated successfully!', 'success');
    } else {
        // Add new record
        student.performance.push(performanceRecord);
        showAlert('Performance added successfully!', 'success');
    }
    
    // Refresh performance history
    displayPerformanceHistory(student);
    
    // Clear form
    document.getElementById('performanceForm').reset();
    
    // Refresh main table (to update average)
    displayStudents();
}

// Validate Scores
function validateScores(math, english, science, social) {
    if (isNaN(math) || isNaN(english) || isNaN(science) || isNaN(social)) {
        showAlert('All scores are required!', 'error');
        return false;
    }
    
    const scores = [math, english, science, social];
    for (let score of scores) {
        if (score < 0 || score > 100) {
            showAlert('Scores must be between 0 and 100!', 'error');
            return false;
        }
    }
    
    return true;
}

// Show Alert Message
function showAlert(message, type) {
    // Remove existing alert
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}