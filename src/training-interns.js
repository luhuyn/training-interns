import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_INTERNS = gql`
query QueryTrainningInternsDto ($filter: GeneralCollectionFilterInput){
   query_Trainning_Interns_dto(filter: $filter) {
      data {
        name
        age
        created_date
      }
    }
  }
  
`;

function TrainingInterns() {
  const [showTable, setShowTable] = useState(false);

  const { loading, error, data } = useQuery(GET_INTERNS,{variables:{
    "filter":{
        "limit": 5
    }
  } });

  const handleClick = () => {
    setShowTable(true);
    console.log(data)
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Training Interns</h2>
      {!showTable && <button onClick={handleClick}>Show Interns</button>}
      {showTable && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {data.query_Trainning_Interns_dto.data.map((intern) => (
              <tr key={intern.name}>
                <td>{intern.name}</td>
                <td>{intern.age}</td>
                <td>{intern.created_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TrainingInterns;
