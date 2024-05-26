import "./Search.css";

const Search: React.FC = () => {
    return (
        <div className="search">
            <img className="search_icon" src="assets/search_icon.png" alt="search_icon" />
            <input type="text" placeholder="Найти..."/>
        </div>
    );
}

export default Search;