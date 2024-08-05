import { Link } from "react-router-dom"


export const Header: React.FC = () => {
    return (
        <header>
            <div className="container">
                <nav>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </nav>

            </div>
        </header>
    );
};