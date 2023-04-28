import { 
    DISPLAY_ALERT, 
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR
} 
from "./action";

const reducer = (state , action)=>{
    if(action.type === DISPLAY_ALERT){
        return{
            ...state,
            showAlert: true,
            alertType: 'danger',
            alertText: 'please provide all the values!'
        }
    }else if(action.type === CLEAR_ALERT){
        return{
            ...state,
            showAlert: false,
            alertType: '',
            alertText: ''
        }
    }
    if(action.type === REGISTER_USER_BEGIN){
        return{
            ...state,
            isLoading: false
        }
    }
    if(action.type === REGISTER_USER_SUCCESS){
        return{
            ...state,
            isLoading: true,
            user: action.payload.user,
            token: action.payload.token,
            userLocation: action.payload.userLocation,
            jobLocation: action.payload.jobLocation,
            showAlert:true,
            alertType: "success",
            alertText: 'user created! Redirecting...'
        }
    }
    if(action.type === REGISTER_USER_ERROR){
        return{
            ...state,
            isLoading: false,
            showAlert:true,
            alertType: "danger",
            alertText: action.payload.msg        
        }
    }
}

export default reducer;