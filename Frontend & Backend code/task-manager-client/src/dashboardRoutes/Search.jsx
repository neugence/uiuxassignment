const Search = ({handleSearch}) => {
  return (
    <div className="">
      <form
        onSubmit={handleSearch}
        className="mx-auto flex justify-center space-x-2"
      >
        <input
          type="text"
          name="search"
          placeholder="Search for Tasks..."
          className="w-52 md:w-80 lg:w-[600px] p-2 border border-purple-400 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-300 backdrop-blur-sm"

        />
        <button
          type="submit"
          className="p-2 lg:px-5 lg:py-2 bg-purple-600 text-white text-lg rounded-lg hover:bg-purple-700 cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
