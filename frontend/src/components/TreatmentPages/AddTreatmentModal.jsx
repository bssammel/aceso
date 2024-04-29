import { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useModal } from '../../context/Modal';
import { addNewTreatment } from '../../store/treatments';
import { getPatientDetails } from '../../store/patients';

function AddTreatmentModal() {
  const dispatch = useDispatch();

  let ptDetailsObj = useSelector((state) => state.patient.patientDetails ? state.patient.patientDetails : null)

  let patientId = useSelector((state) => state.patient.patientDetails.id ? state.patient.patientDetails.id : 0)



  if(ptDetailsObj) patientId = parseInt(ptDetailsObj.id)
//   console.log(ptDetailsObj)
//   console.log(patientId)

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequencyQuantity, setFrequencyQuantity] = useState(null)
  const [frequencyPeriod, setFrequencyPeriod] = useState("day")
//   hour day, week, month, year
// long term other option
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    // const newConditionData = { name, description, status};
    return await dispatch(addNewTreatment({
        name, dosage, frequencyQuantity, frequencyPeriod
    }, patientId))
    .then(() => dispatch(getPatientDetails(patientId)))
    .then(closeModal)
    .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      }
    );
  };

  const statusArr = ["Current", "Controlled", "Resolved", "Chronic", "Intermittent", "Worsening", "Acute"]

  return (
    <>
      <h1>Add Condition</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Condition Name
          <input
            type="text"
            value={name}
            minLength="1" 
            maxLength="75"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <label>
          Description
          <input
            type="textarea"
            value={description}
            maxLength="1999"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        {errors.description && <p>{errors.description}</p>}
        <label>
          Status
        <select
          name='status' id='status' className='select'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required>
            {statusArr.map((status) => (
                  <option key={status} value={status}>{status}
                  </option>))}
          </select>
          </label>
          {errors.status && <p>{errors.status}</p>}
        <div className='submit'><button type="submit">Add Condition</button></div>
        </form>
    </>
  );
}

export default AddConditionModal;
