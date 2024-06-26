import { csrfFetch } from "./csrf";

const CREATE_PATIENT = "patients/createPatient";
const LOAD_PATIENT_DETAILS = "patients/loadPatientDetails";
const LOAD_PATIENT_DETAILS_USERID = "patients/loadPatientUserDetails"
const CLEAR_STATE = "patients/clearState";


export const createPatient = (newPatient) => {
  return {
    type: CREATE_PATIENT,
    newPatient
  }
}

export const loadPatientDetails = (patientDetails) => {
    return {
      type: LOAD_PATIENT_DETAILS,
      patientDetails,
    };
  };

  export const loadPatientUserDetails = (patientUserDetails) => {
    // let patientId = patientUserDetails.id;
    return {
      type: LOAD_PATIENT_DETAILS_USERID,
      patientUserDetails,
    };
  };


  const removeState = () => {
    return{
      type: CLEAR_STATE
    };
  }

export const addNewPatient = (newPtData) => async (dispatch) =>{

  const res = await csrfFetch(`/api/patients`, {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPtData),
  });
  if (!res.ok) {
    return res;
  } else if (res.ok) {
    const createdPt = await res.json();
    dispatch(createPatient(newPtData));
    return createdPt;
  }
};

  export const getPatientDetails = (patientId) => async (dispatch) => {

    const res = await csrfFetch(`/api/patients/${patientId}`);

    if (!res.ok) {
      return res;
    } else if (res.ok){
        const patientDetails = await res.json();
        dispatch(loadPatientDetails(patientDetails));
    }
  }

  export const getPatientUserDetails = (userId) => async (dispatch) => {
    const res = await csrfFetch(`/api/users/${userId}`);
    if (!res.ok) {
      return res;
    } else if (res.ok){
        const patientUserDetails = await res.json();
        dispatch(loadPatientUserDetails(patientUserDetails));
    }
  }

  export const onLogout = () => async (dispatch) => {
    dispatch(removeState());
  }

  const patientReducer = (state = {}, action) => {
    switch (action.type){
        case CREATE_PATIENT: {
          return {...state, "newPatient" : action.newPatient}
        }
        case LOAD_PATIENT_DETAILS: {
          const ptDetailObj = action.patientDetails;
          for (const dataKey in ptDetailObj.User) {
            if (Object.hasOwnProperty.call(ptDetailObj.User, dataKey)) {
              const dataValue = ptDetailObj.User[dataKey];
              if(dataKey !== "id"){
                ptDetailObj[dataKey] = dataValue;
                delete ptDetailObj.User[dataKey];
              }
            }
          }
          delete ptDetailObj.User;
          return {...state, "patientDetails" : ptDetailObj}
        }
        case LOAD_PATIENT_DETAILS_USERID: {
          const ptUserDetailObj = action.patientUserDetails;
          delete ptUserDetailObj.id;
          // reformatting object so that the same component can be use regardless of how the patient details are fetched
          for (const dataKey in ptUserDetailObj.Patient) {
            if (Object.hasOwnProperty.call(ptUserDetailObj.Patient, dataKey)) {
                const dataValue = ptUserDetailObj.Patient[dataKey];
                ptUserDetailObj[dataKey] = dataValue;
                delete ptUserDetailObj.Patient[dataKey];
            }
          }
          delete ptUserDetailObj.Patient;
          return {
            ...state,
            "patientDetails" : ptUserDetailObj
          }
        }
        case CLEAR_STATE:{
          return {}
        }
        default:
            return state;
    }
  }


  export default patientReducer;
