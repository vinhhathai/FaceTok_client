import { useState } from "react";
import CreateGroupModal from "../CreateGroupModal/CreateGroupModal";

function CreateDropdown() {
    const [showModal, setShowModal] = useState(false);
    console.log(showModal);

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    return (
        <>
            {/*Modal*/}
            <CreateGroupModal show={showModal} handleClose={toggleModal} />
            {/*End Modal*/}
            <div className="dropdown-menu dropdown-menu-right nav-dropdown-menu show">
                <button
                    type="button"
                    className="dropdown-item btn"
                    onClick={toggleModal}
                >
                    <div className="row">
                        <div className="col-md-2">
                            <i className="bx bx-group post-option-icon"></i>
                        </div>
                        <div className="col-md-10">
                            <span className="fs-9">Group</span>
                            <small className="form-text text-muted">
                                Bring people together
                            </small>
                        </div>
                    </div>
                </button>
                <a
                    href="#"
                    className="dropdown-item"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div className="row">
                        <div className="col-md-2">
                            <i className="bx bx-calendar post-option-icon"></i>
                        </div>
                        <div className="col-md-10">
                            <span className="fs-9">Post</span>
                            <small className="form-text text-muted">
                                Share your interested things to other peoples
                                today
                            </small>
                        </div>
                    </div>
                </a>
            </div>
        </>
    );
}

export default CreateDropdown;
