import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';

function DashboardHeader({ favoriteCount }) {
  return (
    <div className="header">
      <h2>Student Dashboard</h2>
      <p>Lab Task 2 - State, Effects and Interactivity</p>
      <h3>Total Favorites: {favoriteCount}</h3>
    </div>
  );
}

DashboardHeader.propTypes = {
  favoriteCount: PropTypes.number.isRequired
};

function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search by name or major"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}

SearchBar.propTypes = {
  searchText: PropTypes.string.isRequired,
  setSearchText: PropTypes.func.isRequired
};

function SortControls({ sortType, setSortType }) {
  return (
    <div className="sort-box">
      <button onClick={() => setSortType('default')}>Default</button>
      <button onClick={() => setSortType('name')}>Name A-Z</button>
      <button onClick={() => setSortType('cgpa')}>CGPA High-Low</button>
      <p>Current Sort: {sortType}</p>
    </div>
  );
}

SortControls.propTypes = {
  sortType: PropTypes.string.isRequired,
  setSortType: PropTypes.func.isRequired
};

function CourseTag({ courseName }) {
  return <span className="course-tag">{courseName}</span>;
}

CourseTag.propTypes = {
  courseName: PropTypes.string.isRequired
};

function StatBadge({ label, value }) {
  return (
    <span className="stat-badge">
      {label}: {value}
    </span>
  );
}

StatBadge.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function StudentCard({ student, increaseFavorite, decreaseFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);

  function handleFavorite() {
    if (isFavorite) {
      decreaseFavorite();
    } else {
      increaseFavorite();
    }

    setIsFavorite(!isFavorite);
  }

  return (
    <div className="student-card">
      <img src={student.avatar} alt={student.name} />

      <h2>{student.name}</h2>
      <p>ID: {student.id}</p>
      <p>Major: {student.major}</p>

      <StatBadge label="CGPA" value={student.cgpa} />
      <StatBadge label="Credits" value={student.credits} />

      <div className="courses">
        {student.courses.map((course, index) => (
          <CourseTag key={index} courseName={course} />
        ))}
      </div>

      <button onClick={handleFavorite}>
        {isFavorite ? '★ Remove Favorite' : '☆ Add Favorite'}
      </button>
    </div>
  );
}

StudentCard.propTypes = {
  student: PropTypes.object.isRequired,
  increaseFavorite: PropTypes.func.isRequired,
  decreaseFavorite: PropTypes.func.isRequired
};

function App() {
  const studentData = [
  {
    name: 'MD. Nazmus Sadat Numan',
    id: '22-48497-3',
    avatar: '/images/student1.jpg',
    cgpa: 3.71,
    major: 'CSE',
    credits: 139,
    courses: ['React', 'Database']
  },
  {
    name: 'Papia Sultana Prianka',
    id: '22-48356-3',
    avatar: '/images/student2.jpg',
    cgpa: 3.33,
    major: 'CSE',
    credits: 125,
    courses: ['JavaScript', 'HTML']
  },
  {
    name: 'Hasibul Islam Hasib',
    id: '22-48506-3',
    avatar: '/images/student3.jpg',
    cgpa: 3.26,
    major: 'CSE',
    credits: 120,
    courses: ['Networking', 'Linux']
  },
  {
    name: 'MD. Doad',
    id: '22-48507-3',
    avatar: '/images/student4.jpg',
    cgpa: 3.56,
    major: 'CSE',
    credits: 130,
    courses: ['Python', 'Machine Learning']
  }
];

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState('default');
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setStudents(studentData);
      setLoading(false);
    }, 1500);
  }, []);

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

  useEffect(() => {
    document.title = `Dashboard - ${filteredStudents.length} Students`;
  }, [filteredStudents.length]);

  function increaseFavorite() {
    setFavoriteCount(favoriteCount + 1);
  }

  function decreaseFavorite() {
    setFavoriteCount(favoriteCount - 1);
  }

  return (
    <div className="app">
      <DashboardHeader favoriteCount={favoriteCount} />

      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      <SortControls sortType={sortType} setSortType={setSortType} />

      {loading ? (
        <h2>Loading students...</h2>
      ) : (
        <div className="student-list">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              increaseFavorite={increaseFavorite}
              decreaseFavorite={decreaseFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;