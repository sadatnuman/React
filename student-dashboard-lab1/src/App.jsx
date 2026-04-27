import PropTypes from 'prop-types';
import './App.css';

function DashboardHeader({ title, tagline }) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>

      <nav className="navbar">
        <a href="#">Home</a>
        <a href="#">Students</a>
        <a href="#">Courses</a>
        <a href="#">Profile</a>
      </nav>
    </header>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
};

function CourseTag({ courseName, color }) {
  return (
    <span className="course-tag" style={{ backgroundColor: color }}>
      {courseName}
    </span>
  );
}

CourseTag.propTypes = {
  courseName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

function StatBadge({ label, value }) {
  return (
    <div className="stat-badge">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

StatBadge.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function StudentCard({ name, id, avatar, cgpa, major, courses, credits }) {
  return (
    <div className="student-card">
      <img src={avatar} alt={name} className="student-avatar" />

      <h2>{name}</h2>
      <p className="student-id">ID: {id}</p>
      <p className="major">Department: {major}</p>

      <div className="stats-row">
        <StatBadge label="CGPA" value={cgpa} />
        <StatBadge label="Credits" value={credits} />
      </div>

      <div className="course-list">
        {courses.map((course, index) => (
          <CourseTag
            key={index}
            courseName={course.name}
            color={course.color}
          />
        ))}
      </div>
    </div>
  );
}

StudentCard.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  cgpa: PropTypes.number.isRequired,
  major: PropTypes.string.isRequired,
  credits: PropTypes.number.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

function App() {
  const students = [
    {
      name: 'Student 1',
      id: '22-48497-3',
      avatar: '/images/student1.jpg',
      cgpa: 3.71,
      major: 'CSE',
      credits: 90,
      courses: [
        { name: 'React', color: '#2563eb' },
        { name: 'Database', color: '#16a34a' }
      ]
    },
    {
      name: 'Student 2',
      id: '22-48356-3',
      avatar: '/images/student2.jpg',
      cgpa: 3.33,
      major: 'CSE',
      credits: 85,
      courses: [
        { name: 'JavaScript', color: '#ea580c' },
        { name: 'HTML', color: '#0891b2' }
      ]
    },
    {
      name: 'Student 3',
      id: '22-48506-3',
      avatar: '/images/student3.jpg',
      cgpa: 3.26,
      major: 'CSE',
      credits: 80,
      courses: [
        { name: 'Networking', color: '#4f46e5' },
        { name: 'Linux', color: '#0f766e' }
      ]
    },
    {
      name: 'Student 4',
      id: '22-48507-3',
      avatar: '/images/student4.jpg',
      cgpa: 3.56,
      major: 'CSE',
      credits: 88,
      courses: [
        { name: 'Python', color: '#0284c7' },
        { name: 'Machine Learning', color: '#ca8a04' }
      ]
    }
  ];

  return (
    <div className="app">
      <DashboardHeader
        title="Student Dashboard"
        tagline="A simple React dashboard using components, props, and custom styling"
      />

      <section className="summary-section">
        <StatBadge label="Total Students" value={students.length} />
        <StatBadge label="Department" value="CSE" />
      </section>

      <section className="student-grid">
        {students.map((student, index) => (
          <StudentCard
            key={index}
            name={student.name}
            id={student.id}
            avatar={student.avatar}
            cgpa={student.cgpa}
            major={student.major}
            credits={student.credits}
            courses={student.courses}
          />
        ))}
      </section>
    </div>
  );
}

export default App;