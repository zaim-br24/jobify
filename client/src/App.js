import React from "react";
import {Landing, Register, Error} from './pages/index'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {AddJob, AllJobs, Stats, Profile, SharedLayout} from './pages/Dashboard'
import ProtectedRoute from "./pages/ProtectedRoute";



function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ 
            <ProtectedRoute>
              <SharedLayout/>
            </ProtectedRoute>
          }> 

            <Route path="all-jobs" element={<AllJobs/>}/>
            <Route index element={<Stats/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="add-job" element={<AddJob/>}/>

          </Route>
          <Route path="/register" element={<Register/>} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Error/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
