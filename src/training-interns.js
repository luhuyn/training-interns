import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        created_date
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
        created_date
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
  const [selectedDate, setSelectedDate] = useState(new Date());
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
        _id: editing ? editInternId : null,
        name,
        age: Number(age),
        created_date: selectedDate.toISOString(),
      },
      custominput: null,
      isPublish: true,
    },
  });

  const [updateIntern] = useMutation(UPDATE_INTERN, {
    onCompleted: () => {
      setShowForm(false);
      refetch();
      setEditing(false);
      setEditInternId(null);
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

  const handleSaveIntern = () => {
    if (editing) {
      updateIntern({
        variables: {
          data: {
            _id: editInternId,
            name,
            age: Number(age),
            created_date: selectedDate.toISOString(),
          },
          custominput: null,
          isPublish: true,
        },
      });
    } else {
      saveIntern();
    }
  };

  const handleEditIntern = (intern) => {
    setEditing(true);
    setEditInternId(intern._id);
    setName(intern.name);
    setAge(intern.age);
    setSelectedDate(new Date(intern.created_date));
    setShowForm(true);
  };

  const handleDeleteIntern = (intern) => {
    deleteIntern({
      variables: {
        _id: intern._id,
        custominput: null,
      },
    });
  };

  return (
    <div>
      <h1>Training Interns</h1>
      {!showTable && (
        <button onClick={() => setShowTable(true)}>Show Table</button>
      )}
      {showTable && (
        <div>
          <button onClick={() => setShowTable(false)}>Hide Table</button>
          <button onClick={() => setShowForm(true)}>Add Intern</button>
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
              {data?.query_Trainning_Interns_dto?.data?.map((intern) => (
                <tr key={intern._id}>
                  <td>{intern.name}</td>
                  <td>{intern.age}</td>
                  <td>{new Date(intern.created_date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEditIntern(intern)}>Edit</button>
                    <button onClick={() => handleDeleteIntern(intern)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div>
          <h2>{editing ? 'Edit Intern' : 'Add Intern'}</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveIntern(); }}>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label>
              Age:
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </label>
            <br />
            <label>
              Created Date:
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </label>
            <br />
            <button type="submit">{editing ? 'Save Changes' : 'Add Intern'}</button>
            <button onClick={() => { setShowForm(false); setEditing(false); setEditInternId(null); }}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}
export default TrainingInterns;

