const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]
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
            <div class="">${course.subject} ${course.number}</div>
        `;
        courseList.appendChild(courseItem);
    });
}

function calculateTotalCredits(courses) {
    return courses.reduce((acc, course) => acc + course.credits, 0);
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
    completedWddCourses = wddCourses.filter(course => course.completed);
    const totalWdd = completedWddCourses.reduce((acc, course) => acc + course.credits, 0);
    totalCredits.innerHTML = `Total Credits earned in WDD Courses is: ${totalWdd}`;
});
cseCoursesBtn.addEventListener('click', () => {
    displayCourses(cseCourses);
    completedCseCourses = cseCourses.filter(course => course.completed);
    const totalCse = completedCseCourses.reduce((acc, course) => acc + course.credits, 0);
    totalCredits.innerHTML = `Total Credits earned in CSE Courses is: ${totalCse}`;
});

