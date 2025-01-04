import { useState, useRef, useEffect } from "react";
import createIcon from "../../../assets/images/icons/navbar/create.png";
import CreateDropdown from "../CreateDropdown/CreateDropdown";

function CreateNavbar() {
  // State để kiểm soát việc hiển thị dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  // Sử dụng useRef để tham chiếu đến phần tử cha của dropdown
  const dropdownRef = useRef(null);

  // Sử dụng useEffect để theo dõi sự kiện click bên ngoài dropdown và ẩn nó khi cần thiết
  useEffect(() => {
    function handleClickOutside(event) {
      // Kiểm tra xem dropdownRef đã được thiết lập và sự kiện click có xảy ra bên ngoài dropdown không
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Nếu có, ẩn dropdown
        setShowDropdown(false);
      }
    }

    // Thêm sự kiện click vào body để kiểm tra sự kiện click bên ngoài dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Loại bỏ sự kiện click khi component bị unmount để tránh memory leaks
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]); // Sử dụng dropdownRef trong dependency array để đảm bảo rằng useEffect được gọi lại khi dropdownRef thay đổi

  return (
    <>
      {/* Phần tử cha của dropdown */}
      <li class="nav-item s-nav dropdown d-mobile" ref={dropdownRef}>
        {/* Phần tử mở dropdown */}
        <a
          href="#"
          class="nav-link nav-icon nav-links drop-w-tooltip"
          data-toggle="dropdown"
          data-placement="bottom"
          data-title="Create"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={(e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ anchor
            setShowDropdown(!showDropdown); // Đảo ngược trạng thái hiển thị dropdown khi click
          }}
        >
          {/* Icon */}
          <img src={createIcon} alt="navbar icon" />
        </a>
        {/* Hiển thị dropdown nếu showDropdown là true */}
        {showDropdown ? <CreateDropdown /> : null}
      </li>
    </>
  );
}

export default CreateNavbar;
