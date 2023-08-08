import {FormRow, Alert, FormRowSelect } from '../../components/index'
import { useAppContext } from '../../context/appContext' 
import Wrapper from '../../assets/wrappers/DashboardFormPage'

export default function AddJob() {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob
    
  } = useAppContext()

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(!company || !position || !jobLocation){
       displayAlert()
       return
    }
    if(isEditing){
      editJob()
      return
    }
    createJob()
  }
  const handleJobInput = (e)=>{
    const name = e.target.name;
    const value = e.target.value
    handleChange({name, value})// onChange: based on the Target Input Name : set the value in state {e.target.name : e.target.value  } {position : e.target.value}
  }
    return (
    <Wrapper>
     <h3>{isEditing? "Edit Job": "Add Job"}</h3> 
      {showAlert && <Alert/>}

      <form className='form'>
        <div className='form-center'>
          {/* position */}
          <FormRow type="text" labelText='position' name='position' value={position} handleChange={handleJobInput}/>
          {/* company */}
          <FormRow type="text" labelText='company' name='company' value={company} handleChange={handleJobInput}/>
          {/* location */}
          <FormRow type="text" labelText='job location' name='jobLocation' value={jobLocation} handleChange={handleJobInput}/>
          {/* Job types */}
          <FormRowSelect type="text" labelText='Job types' name='jobType' value={jobType} handleChange={handleJobInput} options={jobTypeOptions}/>
          {/* Job status */}
          <FormRowSelect type="text" labelText='Status' name='status' value={status} handleChange={handleJobInput} options={statusOptions}/>

          <div className='btn-container'>
              <button className='btn btn-block submit-btn' type='submit' onClick={handleSubmit} disabled={isLoading}>submit</button>
              <button
                className='btn btn-block clear-btn' 
                onClick={(e) => {
                  e.preventDefault()
                  clearValues()
                }}
                >
                clear
              </button>               
          </div>
        </div>
        

      </form>
    </Wrapper>
  )
}
