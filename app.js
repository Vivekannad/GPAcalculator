let courses = [];
let semesters = [];
let currentSection = 'gpa';
// JavaScript
let currentRating = 0;
const FEEDBACK_TIME = 30000;

const modal = document.getElementById('feedbackModal');
const stars = document.querySelectorAll('.rating span i');

function showSection(section) {
    document.getElementById('gpaSection').style.display = section === 'gpa' ? 'block' : 'none';
    document.getElementById('cgpaSection').style.display = section === 'cgpa' ? 'block' : 'none';

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active');
    });

    currentSection = section;
}

function addCourse() {
    const courseName = document.getElementById('courseName').value;
    const grade = document.getElementById('grade').value;
    const credits = document.getElementById('credits').value;
    const error = document.getElementById('error');

    if (!courseName || !grade || !credits) {
        error.textContent = "Please fill all fields";
        return;
    }

    error.textContent = "";

    courses.push({
        courseName,
        grade: parseFloat(grade),
        credits: parseFloat(credits)
    });

    updateCoursesList();
    calculateGPA();

    // Clear inputs
    document.getElementById('courseName').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('credits').value = '';
}

function updateCoursesList() {
    const list = document.getElementById('coursesList');
    list.innerHTML = courses.map((course, index) => `
                <div class="course-item">
                    <div>
                        <strong>${course.courseName}</strong><br>
                        Grade: ${course.grade} | Credits: ${course.credits}
                    </div>
                    <button onclick="removeCourse(${index})">×</button>
                </div>
            `).join('');
}

function removeCourse(index) {
    courses.splice(index, 1);
    updateCoursesList();
    calculateGPA();
}

function calculateGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        totalPoints += course.grade * course.credits;
        totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0.00;
    document.getElementById('gpa').textContent = gpa;
}

function addSemester() {
    const gpa = parseFloat(document.getElementById('semesterGpa').value);
    const credits = parseFloat(document.getElementById('semesterCredits').value);
    const error = document.getElementById('cgpaError');

    if (isNaN(gpa) || isNaN(credits) || gpa < 0 || gpa > 4 || credits <= 0) {
        error.textContent = "Please enter valid GPA (0-4) and credits";
        return;
    }

    error.textContent = "";

    semesters.push({
        gpa,
        credits
    });

    updateSemesterList();
    document.getElementById('semesterGpa').value = '';
    document.getElementById('semesterCredits').value = '';
}

function updateSemesterList() {
    const list = document.getElementById('semesterList');
    list.innerHTML = semesters.map((semester, index) => `
                <div class="semester-item">
                    <div>
                        Semester ${index + 1}<br>
                        GPA: ${semester.gpa.toFixed(2)} | Credits: ${semester.credits}
                    </div>
                    <button onclick="removeSemester(${index})">×</button>
                </div>
            `).join('');
}

function removeSemester(index) {
    semesters.splice(index, 1);
    updateSemesterList();
}

function calculateCGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
        totalPoints += semester.gpa * semester.credits;
        totalCredits += semester.credits;
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0.00;
    document.getElementById('cgpa').textContent = cgpa;
}

function resetCGPA() {
    semesters = [];
    updateSemesterList();
    document.getElementById('cgpa').textContent = '0.00';
    document.getElementById('cgpaError').textContent = "";
}

// Modified reset function
function resetCalculator() {
    if (currentSection === 'gpa') {
        courses = [];
        updateCoursesList();
        calculateGPA();
        document.getElementById('error').textContent = "";
    } else {
        resetCGPA();
    }
}

// Store interval ID in a variable accessible to all functions
let feedbackInterval;

// Function to open feedback form
function openFeedback() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.style.display = 'flex';
    // Trigger reflow to ensure transition works
    modalContainer.offsetHeight;
    modalContainer.classList.add('show');
    
    // Clear the interval when modal is opened
    if (feedbackInterval) {
        // clearInterval(feedbackInterval);
        feedbackInterval = false;
    }
}

// Function to close feedback form
function closeFeedback() {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.classList.remove('show');
    setTimeout(() => {
        modalContainer.style.display = 'none';
        // Restart the interval after modal is closed
        if (!feedbackInterval) {
             setTimeout(openFeedback, FEEDBACK_TIME);
        }
    }, 300); // Match this with the transition duration in CSS
}

// Start the interval
 setTimeout(openFeedback, FEEDBACK_TIME);

// Function to handle star rating
function rate(rating) {
    currentRating = rating;
    document.querySelector('#ratingValue').value = rating;
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        } else {
            star.classList.remove('fa-solid');
            star.classList.add('fa-regular');
        }
    });
}

// Add hover effect to stars
document.querySelectorAll('.rating span').forEach((span, index) => {
    span.addEventListener('mouseenter', () => {
        stars.forEach((star, starIndex) => {
            if (starIndex <= index) {
                star.classList.remove('fa-regular');
                star.classList.add('fa-solid');
            }
        });
    });

    span.addEventListener('mouseleave', () => {
        stars.forEach((star, starIndex) => {
            if (starIndex >= currentRating) {
                star.classList.remove('fa-solid');
                star.classList.add('fa-regular');
            }
        });
    });
});

function resetForm(textarea) {
    currentRating = 0;
    document.querySelectorAll(".rating span").forEach(element => element.innerHTML = `<i class="fa-regular fa-star"></i>`)
    textarea.value = "";
    closeFeedback();
}

document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const rating = form.querySelector('#ratingValue').value;
    const message = form.querySelector("textarea");
    resetForm(message);

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("message", message.value);
    feedbackInterval = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Thank you for your feedback!');
            form.reset();
            resetForm(message);
            showToast();
            // Clear interval on successful submission
            // if (feedbackInterval) {
                // clearInterval(feedbackInterval);
            // }
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.log('Error submitting feedback. Please try again.', error.message);
    }
});

let toastBox = document.getElementById("toastBox");
function showToast() {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = "Thank you for submitting";

    toastBox.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3100);
}
