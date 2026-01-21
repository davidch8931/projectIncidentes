import Sidebar from "./Sidebar";

function Layout ({children}){


    return (
        <div className="d-flex">
              <Sidebar/>
             <main className="flex grow mb-4"> 
          
          {children}

            </main>
        </div>
    )
}

export default Layout;