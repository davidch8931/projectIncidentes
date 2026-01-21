import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <div className='bg-dark text-white p-3' style={{ width: "250px", minHeight: "100vh" }}>
            <h3 className='mb-4'>Consumo de api</h3>
            <ul className='nav flex-column'>
                <li className='nav-item mb-2'>
                    <Link to="/" className='nav-link text-white'>
                        <i className='bi bi-house-door me-2'></i> Inicio
                    </Link>
                </li>
                
                <li className='nav-item'>
                    <span className='text-uppercase small text-secondary'>Usuario</span>
                    <ul className='nav flex-column ms-3'>
                        <li className='nav-item'>
                            <Link to="/usuarios" className='nav-link text-white'>
                                <i className='bi bi-list-ul me-2'></i> Listado
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to="/usuarios/nuevo" className='nav-link text-white'>
                                <i className='bi bi-person-plus me-2'></i> Nuevo
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar