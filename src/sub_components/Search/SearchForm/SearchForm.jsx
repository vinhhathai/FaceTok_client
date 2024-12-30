import SearchDropdown from "../SearchDropdown/SearchDropdown";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "../../../utils/useDebounce";
import useSearchApi from "../../../api/useSearchApi";

function SearchForm({ avatarFriend1, avatarFriend2, avatarGroup }) {
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const debouncedValue = useDebounce(searchValue, 1000);
  // const { dataUser, loading, error } = useSearchApi(debouncedValue);
  const searchRef = useRef(null);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (searchRef.current && !searchRef.current.contains(event.target)) {
  //       setSearching(false);
  //     }
  //   }

  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   setSearchValue(value.trim() === "" ? null : value); // Kiểm tra nếu giá trị nhập vào là trống, đặt searchValue thành null, ngược lại giữ nguyên giá trị
  //   setSearching(true);
  // };

  return (
    <>
      <form className="w-30 mx-2 my-auto d-inline form-inline mr-5 dropdown search-form show">
        <div
          className="input-group"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          id="searchDropdown"
          ref={searchRef}
        >
          <input
            type="text"
            className="form-control search-input w-75"
            placeholder="Search for people, groups..."
            aria-label="Search"
            aria-describedby="search-addon"
            value={searchValue || ""} // Nếu searchValue là null, sẽ render input trống
            // onChange={handleSearchChange}
          />
          <div className="input-group-append">
            <button className="btn search-button" type="button">
              <i className="bx bx-search"></i>
            </button>
          </div>
        </div>
        {/* {searching && dataUser.length > 0 && (
          <SearchDropdown
            searchResult={dataUser}
            avatarFriend1={avatarFriend1}
            avatarFriend2={avatarFriend2}
            avatarGroup={avatarGroup}
          />
        )} */}
      </form>
    </>
  );
}

export default SearchForm;
