import { DISPLAY_ALERT , CLEAR_ALERT} from "./action";

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
}

export default reducer;