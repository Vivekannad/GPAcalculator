let courses = [];
        let semesters = [];
        let currentSection = 'gpa';

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