
import { Link } from 'react-router-dom';
import "./navigation.scss";

export default function Navigation(){
    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link to="/Stock/Product">Produtos</Link>
                </li>
                <li>
                    <Link to="/Stock/Command">Comandas</Link>
                </li>
                <li>
                    <Link to="/Stock/Stats">Estatíticas estoque</Link>
                </li>
            </ul>
        </nav>
    )
}