import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const CourseDetailPage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');

  const fetchCourse = async () => {
    if (!user) {
      setError('You must be logged in to view this page.');
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.get(`/api/courses/${id}`, config);
      setCourse(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCourse();
    }
  }, [id, user]);

  const enrollHandler = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      await axios.post(`/api/courses/${id}/enroll`, {}, config);
      alert('Enrolled successfully!');
      fetchCourse(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const addAssignmentHandler = async (e) => {
    e.preventDefault();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const assignmentData = {
        title: assignmentTitle,
        description: assignmentDesc,
        dueDate: assignmentDueDate,
      };
      
      await axios.post(`/api/courses/${id}/assignments`, assignmentData, config);
      alert('Assignment added!');
      setAssignmentTitle('');
      setAssignmentDesc('');
      setAssignmentDueDate('');
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add assignment');
    }
  };
  
  const isInstructor = user && course && user._id === course.instructor._id;
  const isEnrolled = user && course && course.students.some(s => s._id === user._id);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{course.title}</h1>
      <p style={styles.instructor}>
        Instructor: {course.instructor.name} ({course.instructor.email})
      </p>
      <p style={styles.description}>{course.description}</p>
      
      {!isInstructor && !isEnrolled && (
        <button onClick={enrollHandler} style={styles.enrollButton}>
          Enroll in this Course
        </button>
      )}
      {isEnrolled && <p style={styles.enrolledText}>You are enrolled in this course.</p>}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Lectures</h2>
        {course.lectures.length === 0 ? (
          <p>No lectures yet.</p>
        ) : (
          <ul style={styles.list}>
            {course.lectures.map((lecture, index) => (
              <li key={index} style={styles.listItem}>
                {lecture.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Assignments</h2>
        {course.assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          <ul style={styles.list}>
            {course.assignments.map((assignment) => (
              <li key={assignment._id} style={styles.listItem}>
                <strong>{assignment.title}</strong>
                <p>{assignment.description}</p>
                <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                
                {isEnrolled && (
                  <AssignmentSubmitter 
                    courseId={course._id} 
                    assignment={assignment} 
                    user={user}
                    fetchCourse={fetchCourse}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isInstructor && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add New Assignment</h2>
          <form style={styles.form} onSubmit={addAssignmentHandler}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                style={styles.input}
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                value={assignmentDesc}
                onChange={(e) => setAssignmentDesc(e.target.value)}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Due Date</label>
              <input
                type="date"
                style={styles.input}
                value={assignmentDueDate}
                onChange={(e) => setAssignmentDueDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={styles.button}>
              Add Assignment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const AssignmentSubmitter = ({ courseId, assignment, user, fetchCourse }) => {
  const [fileUrl, setFileUrl] = useState('');
  
  const alreadySubmitted = assignment.submissions.find(
    (s) => s.student === user._id
  );
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    
    try {
      await axios.post(
        `/api/courses/${courseId}/assignments/${assignment._id}/submit`, 
        { fileUrl }, 
        config
      );
      alert('Submission successful!');
      setFileUrl('');
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  if (alreadySubmitted) {
    return <p style={styles.submittedText}>Submitted on: {new Date(alreadySubmitted.submittedAt).toLocaleDateString()}</p>;
  }

  return (
    <form style={styles.submitForm} onSubmit={submitHandler}>
      <label style={styles.submitLabel}>Submit Link (Google Doc, GitHub, etc.):</label>
      <div style={styles.submitControls}>
        <input
          type="text"
          style={styles.submitInput}
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="https://..."
          required
        />
        <button type="submit" style={styles.submitButton}>Submit</button>
      </div>
    </form>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  instructor: {
    fontSize: '1rem',
    color: '#555',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  enrollButton: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#28a745',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '2rem',
  },
  enrolledText: {
    color: '#28a745',
    fontWeight: '600',
    marginBottom: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  listItem: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minHeight: '100px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  submittedText: {
    color: '#28a745',
    fontWeight: '600',
    marginTop: '1rem',
  },
  submitForm: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  submitLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  submitControls: {
    display: 'flex',
  },
  submitInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  submitButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#555',
    color: 'white',
    cursor: 'pointer',
    marginLeft: '0.5rem',
  },
};

export default CourseDetailPage;