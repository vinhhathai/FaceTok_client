import './ProfileThumbnail.css'
function ProfileThumbnail() {
    return (
        <>
            <div className="profile-header-background">
                <div className="profile-cover">
                    <img 
                        src="https://artmin96.github.io/argon-social/assets/images/users/cover/cover-1.gif" 
                        alt="Profile Header Background"
                    />
                    <div className="cover-overlay">
                        <button className="btn btn-update-cover">
                            <i className="bx bxs-camera"></i> Update Cover Photo
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileThumbnail;
