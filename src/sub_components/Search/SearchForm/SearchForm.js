import SearchDropdown from "../SearchDropdown/SearchDropdown";

function SearchForm({ avatarFriend1, avatarFriend2, avatarGroup }) {
  return (
    <>
      <form class="w-30 mx-2 my-auto d-inline form-inline mr-5 dropdown search-form show">
        <div
          class="input-group"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          id="searchDropdown"
        >
          <input
            type="text"
            class="form-control search-input w-75"
            placeholder="Search for people, groups..."
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <div class="input-group-append">
            <button class="btn search-button" type="button">
              <i class="bx bx-search"></i>
            </button>
          </div>
        </div>
        <SearchDropdown avatarFriend1={avatarFriend1} avatarFriend2={avatarFriend2} avatarGroup={avatarGroup} />
      </form>
    </>
  );
}

export default SearchForm;