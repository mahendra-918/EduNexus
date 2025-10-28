import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{course.title}</h3>
      <p style={styles.instructor}>
        Instructor: {course.instructor ? course.instructor.name : 'N/A'}
      </p>
      <Link to={`/course/${course._id}`} style={styles.button}>
        View Details
      </Link>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    margin: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '0.5rem',
  },
  instructor: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '1rem',
  },
  button: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    fontWeight: '600',
  },
};

export default CourseCard;