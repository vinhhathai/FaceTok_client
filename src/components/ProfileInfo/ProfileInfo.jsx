import './ProfileInfo.css'
function ProfileInfo() {
    return (
        <div className="col-md-3 profile-info">
            <div className="profile-info-left">
                <div className="text-center">
                    <div className="profile-img w-shadow">
                        <div className="profile-img-overlay"></div>
                        <img
                            src="https://artmin96.github.io/argon-social/assets/images/users/user-4.jpg"
                            alt="Avatar"
                            className="avatar img-circle"
                        />
                        <div className="profile-img-caption">
                            <label htmlFor="updateProfilePicInput" className="upload">
                                <i className="bx bxs-camera"></i> Update
                                <input
                                    type="file"
                                    id="updateProfilePicInput"
                                    className="text-center upload"
                                />
                            </label>
                        </div>
                    </div>
                    <p className="profile-fullname mt-3">Arthur Minasyan</p>
                    <p className="profile-username mb-3 text-muted">@arthur_minasyan</p>
                </div>
                <div className="intro mt-4">
                    <div className="d-flex">
                        <button type="button" className="btn btn-follow mr-3">
                            <i className="bx bx-plus"></i> Follow
                        </button>
                        <button
                            type="button"
                            className="btn btn-start-chat"
                            data-toggle="modal"
                            data-target="#newMessageModal"
                        >
                            <i className="bx bxs-message-rounded"></i>{" "}
                            <span className="fs-8">Message</span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-follow"
                            id="moreMobile"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="bx bx-dots-horizontal-rounded"></i>{" "}
                            <span className="fs-8">More</span>
                        </button>
                        <div
                            className="dropdown-menu dropdown-menu-right profile-ql-dropdown"
                            aria-labelledby="moreMobile"
                        >
                            <a href="newsfeed.html" className="dropdown-item">
                                Timeline
                            </a>
                            <a href="about.html" className="dropdown-item">
                                About
                            </a>
                            <a href="followers.html" className="dropdown-item">
                                Followers
                            </a>
                            <a href="following.html" className="dropdown-item">
                                Following
                            </a>
                            <a href="photos.html" className="dropdown-item">
                                Photos
                            </a>
                            <a href="videos.html" className="dropdown-item">
                                Videos
                            </a>
                            <a href="check-ins.html" className="dropdown-item">
                                Check-Ins
                            </a>
                            <a href="events.html" className="dropdown-item">
                                Events
                            </a>
                            <a href="likes.html" className="dropdown-item">
                                Likes
                            </a>
                        </div>
                    </div>
                </div>
                <div className="intro mt-5 mv-hidden">
                    <div className="intro-item d-flex justify-content-between align-items-center">
                        <h3 className="intro-about">Intro</h3>
                    </div>
                    <div className="intro-item d-flex justify-content-between align-items-center">
                        <p className="intro-title text-muted">
                            <i className="bx bx-briefcase text-primary"></i> Web Developer at{" "}
                            <a href="#">Company Name</a>
                        </p>
                    </div>
                    <div className="intro-item d-flex justify-content-between align-items-center">
                        <p className="intro-title text-muted">
                            <i className="bx bx-map text-primary"></i> Lives in{" "}
                            <a href="#">City, Country</a>
                        </p>
                    </div>
                    <div className="intro-item d-flex justify-content-between align-items-center">
                        <p className="intro-title text-muted">
                            <i className="bx bx-time text-primary"></i> Last Login{" "}
                            <a href="#">
                                Online <span className="ml-1 online-status bg-success"></span>
                            </a>
                        </p>
                    </div>
                    <div className="intro-item d-flex justify-content-between align-items-center">
                        <button className="btn btn-quick-link join-group-btn border w-100">
                            Edit Details
                        </button>
                    </div>
                </div>
                
                
            </div>
        </div>
    );
}

export default ProfileInfo;
