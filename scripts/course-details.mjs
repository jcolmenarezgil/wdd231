import { courses } from "../data/course.js";

const courseDetails = document.querySelector("#course-details");

/* source */
const courseList = document.querySelector('#courseList');
const totalCredits = document.querySelector('#totalCredits');
/* Course filters buttons*/
const allCoursesBtn = document.querySelector('#allCourses');
const wddCoursesBtn = document.querySelector('#wddCourses');
const cseCoursesBtn = document.querySelector('#cseCourses');

/* Courses array */
const allCourses = courses;
const cseCourses = courses.filter(course => course.subject === 'CSE');
const wddCourses = courses.filter(course => course.subject === 'WDD');

/* Function to display courses */
function displayCourses(courses) {
    courseList.innerHTML = ''; // Clear the list before displaying new courses
    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.classList.add('course-item');
        if (course.completed) {
            courseItem.classList.add('Completed');
        } else {
            courseItem.classList.add('in-progress');
        }
        courseItem.innerHTML = `
            <div>${course.subject} ${course.number}</div>
        `;
        courseItem.addEventListener('click', () => displayCoursesDetails(course));
        courseList.appendChild(courseItem);
    });
}

function calculateTotalCredits(courses) {
    return courses.reduce((acc, course) => acc + course.credits, 0);
}

function displayCoursesDetails(course) {
    courseDetails.innerHTML = '';
    courseDetails.innerHTML = `
    <button id="closeModal"> ❌ </button>
    <h2>${course.subject} ${course.number}</h2>
    <h3>${course.title}</h3>
    <p><strong>Credits</strong> ${course.credits}</p>
    <p><strong>Certificate</strong> ${course.certificate}</p>
    <p>${course.description}</p>
    <p><strong>Technologies</strong> ${course.technology.join(', ')}</p>
    `;
    courseDetails.showModal();

    closeModal.addEventListener("click", () => {
        courseDetails.close();
    });
}

displayCourses(allCourses); // Display all courses by default
totalCredits.innerHTML = `The total number of credits earned is: ${calculateTotalCredits(allCourses)}`; // Display total credits for all courses

/* Event listeners for filter buttons */
/* reduce and get the displayed only Completed credist  */
allCoursesBtn.addEventListener('click', () => {
    displayCourses(allCourses);
    /* get only completed credist */
    const completedCourses = allCourses.filter(course => course.completed);
    const total = completedCourses.reduce((acc, course) => acc + course.credits, 0);
    totalCredits.innerHTML = `The total number of credits earned is: ${total}`;
});
wddCoursesBtn.addEventListener('click', () => {
    displayCourses(wddCourses);
    const completedWddCourses = wddCourses.filter(course => course.completed);
    const totalWdd = completedWddCourses.reduce((acc, course) => acc + course.credits, 0);
    totalCredits.innerHTML = `Total Credits earned in WDD Courses is: ${totalWdd}`;
});
cseCoursesBtn.addEventListener('click', () => {
    displayCourses(cseCourses);
    const completedCseCourses = cseCourses.filter(course => course.completed);
    const totalCse = completedCseCourses.reduce((acc, course) => acc + course.credits, 0);
    totalCredits.innerHTML = `Total Credits earned in CSE Courses is: ${totalCse}`;
});

