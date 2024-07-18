import useBookStore from "../store/bookStore";

function Search() {
  const { country } = useBookStore();
  return (
    <>
      <div>{country}</div>
    </>
  );
}

Search.propTypes = {};

export default Search;
