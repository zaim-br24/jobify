import React from 'react'
import main from '../assets/images/main.svg'
import {Logo} from '../components/index'
import { Link } from 'react-router-dom'
import Wrapper from '../assets/wrappers/LandingPage'

export default function Landing() {
  return (
    <Wrapper>
        <nav>
           <Link to="/">
              <Logo/>
           </Link> 
        </nav>
        <div className="container page">
            <div className="info">
                <h1>Job <span>Tracking</span> app</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                    molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                    numquam blanditiis harum quisquam eius sed odit fugiat iusto
                </p>
                <Link to="/register" className='btn btn-hero'>login/register</Link> 
            </div>

             <img src={main} alt="job hunter" className='img main-img' />
        </div>

    </Wrapper>
  )
}


