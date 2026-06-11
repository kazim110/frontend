import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'

function AppLayout({ children, auth }) {
  return (
    <div className="app-frame">
      <Header auth={auth} />

      <div className="app-layout">
        <Sidebar auth={auth} />
        <div className="app-content">{children}</div>
      </div>

      <Footer />
    </div>
  )
}

export default AppLayout
