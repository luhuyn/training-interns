import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_INTERNS = gql`
  query QueryTrainningInternsDto($filter: GeneralCollectionFilterInput) {
    query_Trainning_Interns_dto(filter: $filter) {
      data {
        _id
        name
        age
        created_date
      }
    }
  }
`;
const SAVE_INTERN = gql`
  mutation SaveTrainningInternDto($data: Trainning_InternInputDto!, $custominput: Dictionary, $isPublish: Boolean) {
    save_Trainning_Intern_dto(data: $data, custominput: $custominput, isPublish: $isPublish) {
      data {
        _id
        name
        age
      }
    }
  }
`;

const UPDATE_INTERN = gql`
mutation SaveTrainningInternDto($data: Trainning_InternInputDto!, $custominput: Dictionary, $isPublish: Boolean) {
  save_Trainning_Intern_dto(data: $data, custominput: $custominput, isPublish: $isPublish) {
    data{
      _id
      name
      age
  } 
}
}
`;

const DELETE_INTERN = gql`
  mutation RemoveTrainningInternDto($_id: String!, $custominput: Dictionary) {
    remove_Trainning_Intern_dto(_id: $_id, custominput: $custominput) {
      data {
        _id
      }
    }
  }
`;

function TrainingInterns() {
  const [showTable, setShowTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editInternId, setEditInternId] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_INTERNS, {
    variables: {
      filter: {
        limit: 30,
      },
    },
  });
  const [saveIntern] = useMutation(SAVE_INTERN, {
    onCompleted: () => {
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
    variables:
    {
      data: {
        _id: editInternId,
        name,
        age,
      },
      custominput: {},
      isPublish: true,
    },
  }
  );
  const [updateIntern] = useMutation(UPDATE_INTERN, {
    onCompleted: () => {
      setShowForm(false);
      setEditing(false);
      setEditInternId(null);
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const [deleteIntern] = useMutation(DELETE_INTERN, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleInsertClick = () => {
    setShowForm(true);
    setEditing(false);
    setName('');
    setAge(0);
  };

  const handleEditClick = (id, name, age) => {
    setShowForm(true);
    setEditing(true);
    setName(name);
    setAge(age);
    setEditInternId(id);
  };

  const handleDeleteClick = (id) => {
    deleteIntern({
      variables: {
        _id: id,
        custominput: null,
      },
    });
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      alert('Name is required');
      return;
    }
    const ageValue = Number(age);
    if (!Number.isInteger(ageValue) || ageValue < 0) {
      alert('Age must be a non-negative integer');
      return;
    }
    if (editing) {
      updateIntern({
        variables: {
          data: {
            _id: editInternId,
            name,
            age: ageValue,
          },
          custominput: {},
          isPublish: true,
        },
      });
    } else {
      saveIntern({
        variables: {
          data: {
            name,
            age: ageValue,
          },
          custominput: {},
          isPublish: true,
        },
      });
    }
    setShowForm(false);
  };  


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Training Interns</h2>
      {!showTable && (
        <button onClick={() => setShowTable(true)}>Show Table</button>
      )}
      {showTable && (
        <div>
          <button onClick={() => setShowTable(false)}>Hide Table</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.query_Trainning_Interns_dto.data.map((intern) => (
                <tr key={intern._id}>
                  <td>{intern.name}</td>
                  <td>{intern.age}</td>
                  <td>{intern.created_date}</td>
                  <td>
                    <button onClick={() => handleEditClick(intern._id, intern.name, intern.age)}>Edit</button>
                    <button onClick={() => handleDeleteClick(intern._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br />
          <button onClick={handleInsertClick}>Insert New Intern</button>
        </div>
      )}
      {showForm && (
        <div>
          <form onSubmit={handleFormSubmit}>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label>
              Age:
              <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
            </label>
            <br />
            <button type="submit">{editing ? 'Update Intern' : 'Save Intern'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
export default TrainingInterns;

