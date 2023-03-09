import React from 'react'
import { Link } from 'react-router-dom'
import Wrapper from '../assets/wrappers/ErrorPage'
import img from '../assets/images/not-found.svg'

export default function Error() {

  return (
    <Wrapper className='full-page'>
        <div>
            <img src={img} alt="" />
            <h3>Ohh!! Page not found.</h3>
            <p>we can't seem to find the page your looking for</p>
            <Link to="/">Back home</Link>
       </div>
    </Wrapper>
  )
}
