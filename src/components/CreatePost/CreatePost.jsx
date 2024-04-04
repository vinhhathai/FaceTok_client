import mediaIcon from "../../assets/images/icons/theme/post-image.png";

function CreatePost() {
  return (
    <>
      <ul className="list-unstyled" style={{ marginBottom: 0 }}>
        <li className="media post-form w-shadow">
          <div className="media-body">
            <div className="form-group post-input">
              <textarea
                className="form-control"
                id="postForm"
                rows="2"
                placeholder="What's on your mind, Arthur?"
              ></textarea>
            </div>
            <div className="row post-form-group">
              <div className="col-md-9 text-left">
                <button
                  type="button"
                  className="btn btn-link post-form-btn btn-sm"
                >
                  <img src={mediaIcon} alt="post form icon" className="mr-1" />{" "}
                  {/* Sử dụng lớp mr-1 để thêm margin-right */}
                  <span>Photo/Video+</span>
                </button>
              </div>

              <div className="col-md-3 text-right">
                <button type="button" className="btn btn-primary btn-sm">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}

export default CreatePost;
