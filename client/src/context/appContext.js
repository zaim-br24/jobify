import React, { useReducer, useContext} from 'react'
import { CLEAR_ALERT,
   DISPLAY_ALERT,
   REGISTER_USER_BEGIN,
   REGISTER_USER_SUCCESS,
   REGISTER_USER_ERROR,
   LOGIN_USER_BEGIN,
   LOGIN_USER_SUCCESS,
   LOGIN_USER_ERROR,
   SETUP_USER_BEGIN,
   SETUP_USER_SUCCESS,
   SETUP_USER_ERROR,
   TOGGLE_SIDEBAR,
   LOGOUT_USER,
   UPDATE_USER_BEGIN,
   UPDATE_USER_SUCCESS,
   UPDATE_USER_ERROR,
   HANDLE_CHANGE,
   CLEAR_VALUES,
   CREATE_JOB_BEGIN,
   CREATE_JOB_SUCCESS,
   CREATE_JOB_ERROR,
   GET_JOBS_BEGIN,
   GET_JOBS_SUCCESS,
   SET_EDIT_JOB,
   EDIT_JOB_BEGIN,
   EDIT_JOB_SUCCESS,
   EDIT_JOB_ERROR,
   DELETE_JOB_BEGIN,
   SHOW_STATS_BEGIN,
   SHOW_STATS_SUCCESS,
   CHANGE_PAGE

  } from './action'
import reducer from './reducer'
import axios from 'axios'

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const userLocation = localStorage.getItem('location')

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) :  null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false,
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    // jobLocation
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats:[],
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],

}


const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const authFetch = axios.create({
      baseURL: '/api/v1',
      headers: {
        Authorization: `Bearer ${state.token}`,
      },
    })
    // response interceptor
    authFetch.interceptors.request.use(
      (config) => {
        // config.headers.common['Authorization'] = `Bearer ${state.token}`
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // response interceptor
    authFetch.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (error.response.status === 401) {
          // console.log('AUTH ERROR')
          logoutUser()
        }
        return Promise.reject(error)
      }
    )

    const displayAlert = ()=> {
        dispatch({type: DISPLAY_ALERT})
        clearAlert()
    }
    const clearAlert = ()=>{
        setTimeout(()=>{
            dispatch({type: CLEAR_ALERT})
        },3000)
    }

  const addUserToLocalStorage = ({user, token, location})=>{
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token);
      localStorage.setItem('location', location)
  }
  const removeUserFromLocalStorage = ()=>{
    localStorage.removeItem('user')
    localStorage.removeItem('token');
    localStorage.removeItem('location')
 }
//------------------------- REGISTER USER TO FRONTEND ---------------------------------

    const registerUser = async (currentUser)=>{
      dispatch({type: REGISTER_USER_BEGIN})
    
      try {
        const response = await axios.post('/api/v1/auth/register', currentUser);
        const {user, token, location} = response.data

        dispatch({
          type: REGISTER_USER_SUCCESS, 
          payload:{
            user,
            token,
            location
          }})
          //localstorage 
         addUserToLocalStorage({user, token, location})
      } catch (error) {
        dispatch({
          type: REGISTER_USER_ERROR,
          payload:{
            msg: error.response.data.msg
          }
        })
      }
      clearAlert()
    } 
//------------------------- LOGIN USER TO FRONTEND ---------------------------------

    const loginUser = async (currentUser)=>{
      dispatch({type: LOGIN_USER_BEGIN})

      try {
        const {data} = await axios.post('/api/v1/auth/login', currentUser);
        const {user, token, location} = data

        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload:{
            user, token, location
          }
        })
        //add {user, token, location} to localStorage
        addUserToLocalStorage({user, token, location})

      } catch (error) {
        displayAlert()
        dispatch({
          type: LOGIN_USER_ERROR,
          payload:{
            msg: error.response.data.msg
          }
        })
      }
      clearAlert()

    }
    //---------------------- refactor (login / register) in one function -------------------
    const setupUser = async ({currentUser, endPoint, alertText})=>{ 
      dispatch({type: SETUP_USER_BEGIN})

      try {
        const {data} = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);
        const {user, token, location} = data

        dispatch({
          type: SETUP_USER_SUCCESS,
          payload:{
            alertText: alertText,
            user, 
            token,
            location
          }
        })
        //add {user, token, location} to localStorage
        addUserToLocalStorage({user, token, location})

      } catch (error) {
        displayAlert()
        dispatch({
          type: SETUP_USER_ERROR,
          payload:{
            msg: error.response.data.msg
          }
        })
      }
      clearAlert()

    }
  
  
    const updateUser = async (currentUser) => {
      dispatch({ type: UPDATE_USER_BEGIN })

      try {
        const { data } = await authFetch.patch('/auth/updateUser', currentUser)
    
        // no token
        const { user, location, token } = data
    
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: { user, location, token },
        })
    
        addUserToLocalStorage({ user, location, token })
      } catch (error) {

        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
      clearAlert()
    }  
    
    const logoutUser = ()=>{
      dispatch({type: LOGOUT_USER})
      removeUserFromLocalStorage()
    }
 // HANDLE CHANHE FOR INPUT
    const handleChange = ({name, value})=>{
      dispatch({
        type: HANDLE_CHANGE,
        payload: {name, value}
      })
    }

    const clearValues = ()=>{
      dispatch({type: CLEAR_VALUES})
    }

  // create job

  const createJob  = async ()=>{
    dispatch({type:CREATE_JOB_BEGIN})
    try {
      const {company, position, status, jobType} = state
      await authFetch.post('/jobs', {company, position, status, jobType})
      dispatch({type: CREATE_JOB_SUCCESS})
      // clearing values by calling function instead of clearValues(); (it's the same)
      dispatch({type: CLEAR_VALUES})
    } catch (error) {
      if(error.response.status === 401) return
      dispatch({type: CREATE_JOB_ERROR, payload:{msg: error.response.data.msg}})
    }
    clearAlert()
  }

  // getJobs
  const getJobs = async ()=>{
    const { search, searchStatus, searchType, sort , page} = state
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({type: GET_JOBS_BEGIN})
    try {
      const {data} = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload:{
          jobs,
          totalJobs,
          numOfPages
        }
      })
    } catch (error) {
      logoutUser()
    }
  }
  const setEditJob = (id) => {
    dispatch({type: SET_EDIT_JOB , payload:{id}})
  }
  //Edit JOB
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status } = state
  
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      })
      dispatch({
        type: EDIT_JOB_SUCCESS,
      })
      dispatch({ type: CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  // Delete JOB
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs() // we have re fetch jobs from database because we deleted from it.
    } catch (error) {
      logoutUser()
    }
  }
 
  const showStats = async ()=>{
    dispatch({type: SHOW_STATS_BEGIN})
    try {
      const {data} = await authFetch('/jobs/stats')

      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload:{
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications
        }
      })
      
    } catch (error) {
      
    if (error.response.status === 401) {
            logoutUser()
        }    
      }
    clearAlert()
  }
  // change page
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } })
  }
  // clear filter
  const clearFilters = ()=>{
    console.log('filter cleared')
  }
 //------------------- toggle sidebar ------------------
    const toggleSidebar = ()=>{
      dispatch({type: TOGGLE_SIDEBAR})
    }

  
    return (
      <AppContext.Provider 
        value={{
          ...state,
          displayAlert,
          clearAlert,
          registerUser,
          loginUser,
          setupUser,
          toggleSidebar,
          logoutUser,
          updateUser,
          handleChange,
          clearValues,
          createJob,
          getJobs,
          setEditJob,
          editJob,
          deleteJob,
          showStats,
          clearFilters,
          changePage
        }}
      >
        {children}
      </AppContext.Provider>
    )
  }




export const useAppContext = ()=>{ 
  return  useContext(AppContext)
}

export {
    AppProvider,
    initialState 
}