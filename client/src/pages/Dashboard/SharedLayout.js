import { Link, Outlet } from "react-router-dom"
import Wrapper from "../../assets/wrappers/SharedLayout"
import { SmallSidebar, BigSidebar,Navbar } from "../../components"

import { useAppContext } from "../../context/appContext"
export default function SharedLayout() {
  const {showSidebar} = useAppContext()
  return (
    <>
    <Wrapper>
        <main className="dashboard">
          <BigSidebar/>
          {
            showSidebar && <SmallSidebar/>
          }
          <div>
          <Navbar/>
            <div className="dashboard-page">
              <Outlet/>
            </div>
          </div>
        </main>
    </Wrapper>
    </>
  )
}
