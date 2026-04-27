import { createContext, useContext, useEffect, useState } from 'react';
import './App.css';

const ThemeContext = createContext();
const StudentContext = createContext();

const defaultStudents = [
  {
    name: 'MD. Nazmus Sadat Numan',
    id: '22-48497-3',
    avatar: '/images/student1.jpg',
    cgpa: 3.71,
    major: 'CSE',
    courses: ['React', 'Database']
  },
  {
    name: 'Papia Sultana Prianka',
    id: '22-48356-3',
    avatar: '/images/student2.jpg',
    cgpa: 3.33,
    major: 'CSE',
    courses: ['JavaScript', 'HTML']
  },
  {
    name: 'Hasibul Islam Hasib',
    id: '22-48506-3',
    avatar: '/images/student3.jpg',
    cgpa: 3.26,
    major: 'CSE',
    courses: ['Networking', 'Linux']
  },
  {
    name: 'MD. Doad',
    id: '22-48507-3',
    avatar: '/images/student4.jpg',
    cgpa: 3.56,
    major: 'CSE',
    courses: ['Python', 'Machine Learning']
  }
];

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function StudentProvider({ children }) {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students');

    if (savedStudents) {
      return JSON.parse(savedStudents);
    }

    return defaultStudents;
  });

  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('default');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (message !== '') {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  function addStudent(newStudent) {
    setStudents([...students, newStudent]);
    setMessage('Student added successfully!');
  }

  function removeStudent(id) {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);

    const updatedFavorites = favoriteIds.filter((favId) => favId !== id);
    setFavoriteIds(updatedFavorites);
  }

  function toggleFavorite(id) {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter((favId) => favId !== id));
    } else {
      setFavoriteIds([...favoriteIds, id]);
    }
  }

  let filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.major.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  if (sortType === 'name') {
    filteredStudents = [...filteredStudents].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  if (sortType === 'cgpa') {
    filteredStudents = [...filteredStudents].sort((a, b) => b.cgpa - a.cgpa);
  }

  return (
    <StudentContext.Provider
      value={{
        students,
        filteredStudents,
        searchText,
        setSearchText,
        sortType,
        setSortType,
        favoriteIds,
        toggleFavorite,
        addStudent,
        removeStudent,
        message
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

function DashboardHeader() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { favoriteIds } = useContext(StudentContext);

  return (
    <div className="header">
      <h2 class = "h2">Student Dashboard</h2>
      <p>Lab Task 3 - Context API and Form Validation</p>
      <p>Total Favorites: {favoriteIds.length}</p>

      <button onClick={toggleTheme}>
        Change to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}

function SearchBar() {
  const { searchText, setSearchText } = useContext(StudentContext);

  return (
    <div className="box">
      <input
        type="text"
        placeholder="Search by name or major"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}

function SortControls() {
  const { sortType, setSortType } = useContext(StudentContext);

  return (
    <div className="box">
      <button onClick={() => setSortType('default')}>Default</button>
      <button onClick={() => setSortType('name')}>Name A-Z</button>
      <button onClick={() => setSortType('cgpa')}>CGPA High-Low</button>
      <p>Current Sort: {sortType}</p>
    </div>
  );
}

function StudentCard({ student }) {
  const { favoriteIds, toggleFavorite, removeStudent } = useContext(StudentContext);
  const isFavorite = favoriteIds.includes(student.id);

  return (
    <div className="student-card">
      <img src={student.avatar} alt={student.name} />

      <h2>{student.name}</h2>
      <p>ID: {student.id}</p>
      <p>Major: {student.major}</p>
      <p>CGPA: {student.cgpa}</p>

      <div>
        {student.courses.map((course, index) => (
          <span className="course" key={index}>
            {course}
          </span>
        ))}
      </div>

      <button onClick={() => toggleFavorite(student.id)}>
        {isFavorite ? '★ Remove Favorite' : '☆ Add Favorite'}
      </button>

      <button onClick={() => removeStudent(student.id)}>
        Remove Student
      </button>
    </div>
  );
}

function AddStudentForm() {
  const { students, addStudent, message } = useContext(StudentContext);

  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [major, setMajor] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [courses, setCourses] = useState('');
  const [errors, setErrors] = useState({});

  function validateForm() {
    const newErrors = {};

    if (name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (id.trim() === '') {
      newErrors.id = 'Student ID is required';
    } else if (isNaN(id)) {
      newErrors.id = 'Student ID must be numeric';
    } else if (students.some((student) => student.id === id)) {
      newErrors.id = 'Student ID must be unique';
    }

    if (major.trim() === '') {
      newErrors.major = 'Major is required';
    }

    if (cgpa === '') {
      newErrors.cgpa = 'CGPA is required';
    } else if (Number(cgpa) < 0 || Number(cgpa) > 4.0) {
      newErrors.cgpa = 'CGPA must be between 0 and 4.0';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const newStudent = {
      name: name,
      id: id,
      avatar: '/images/student1.jpg',
      major: major,
      cgpa: Number(cgpa),
      courses: courses.split(',').map((course) => course.trim())
    };

    addStudent(newStudent);

    setName('');
    setId('');
    setMajor('');
    setCgpa('');
    setCourses('');
    setErrors({});
  }

  return (
    <div className="form-box">
      <h2>Add New Student</h2>

      {message && <p className="success">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Student ID</label>
        <input value={id} onChange={(e) => setId(e.target.value)} />
        {errors.id && <p className="error">{errors.id}</p>}

        <label>Major</label>
        <input value={major} onChange={(e) => setMajor(e.target.value)} />
        {errors.major && <p className="error">{errors.major}</p>}

        <label>CGPA</label>
        <input value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
        {errors.cgpa && <p className="error">{errors.cgpa}</p>}

        <label>Courses comma separated</label>
        <input
          value={courses}
          onChange={(e) => setCourses(e.target.value)}
          placeholder="React, Database"
        />

        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const { filteredStudents } = useContext(StudentContext);

  useEffect(() => {
    document.title = `Dashboard - ${filteredStudents.length} Students`;
  }, [filteredStudents.length]);

  return (
    <div className={theme === 'light' ? 'app light' : 'app dark'}>
      <DashboardHeader />
      <SearchBar />
      <SortControls />

      <div className="student-list">
        {filteredStudents.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      <AddStudentForm />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <Dashboard />
      </StudentProvider>
    </ThemeProvider>
  );
}

export default App;