import React, { useState, useEffect } from 'react';

function CreateGroupModal({ show, handleClose }) {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    const handleCreateGroup = () => {
        // Kiểm tra xem ô input có trống không
        if (groupName.trim() === '') {
            setError('Please enter group name');
            return;
        }

        // Thực hiện các hành động cần thiết khi tạo nhóm
        console.log('Tên nhóm mới:', groupName);
        // Đóng modal sau khi tạo nhóm thành công
        handleClose();
    };

    useEffect(() => {
        setGroupName('');
        setError('');
    }, [show]);

    // Xử lý sự kiện đóng modal khi nhấp vào backdrop
    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal')) {
            handleClose();
        }
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }} onClick={handleBackdropClick}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create group</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="groupName">Write the name of group:</label>
                                <input
                                    type="text"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    id="groupName"
                                    value={groupName}
                                    onChange={(e) => {
                                        setGroupName(e.target.value);
                                        setError('');
                                    }}
                                />
                                {error && <div className="invalid-feedback">{error}</div>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleCreateGroup}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal backdrop */}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
}

export default CreateGroupModal;
