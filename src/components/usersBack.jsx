import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersBack = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://edunova-back-rqxc.onrender.com/api/users?page=${currentPage}&limit=${itemsPerPage}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            const { users, totalPages, totalUsers } = response.data;
            setUsers(users);
            setTotalPages(totalPages);
            setTotalUsers(totalUsers);
        } catch (err) {
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

    const handleUserEdit = (user) => {
        setSelectedUser({ ...user });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(
                `https://edunova-back-rqxc.onrender.com/api/users/${selectedUser._id}`,
                selectedUser,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchUsers();
            setSelectedUser(null); // Close modal after update
        } catch (err) {
            setError('Failed to update user');
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            setSelectedUser({
                ...selectedUser,
                photo: e.target.files[0], // Handle file input
            });
        } else {
            setSelectedUser({
                ...selectedUser,
                [name]: type === "number" ? Number(value) : value, // Convert number fields
            });
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`https://edunova-back-rqxc.onrender.com/api/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                fetchUsers();
            } catch (err) {
                setError('Failed to delete user');
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="app-wrapper">
            <div className="app-content pt-3 p-md-3 p-lg-4">
                <div className="container-xl">
                    <h2 className="mb-4 text-center">Users Management</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : (
                        <div className="table-responsive" style={{ minHeight: '60vh' }}>
                            <table className="table table-striped table-bordered fs-4">
                                <thead className="bg-primary text-white">
                                    <tr>
                                        <th>#</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Age</th>
                                        <th>Email</th>
                                        <th>Country</th>
                                        <th>Verified</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr key={user._id}>
                                                <td>{index + 1}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.age}</td>
                                                <td>{user.email}</td>
                                                <td>{user.country}</td>
                                                <td>
                                                    <span className={`badge ${user.verified ? 'bg-success' : 'bg-warning'}`}>
                                                        {user.verified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <button
                                                            className="btn btn-warning btn-lg me-2"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editModal"
                                                            onClick={() => handleUserEdit(user)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-lg"
                                                            onClick={() => handleDelete(user._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-3">
                        <button
                            className="btn btn-primary btn-lg me-2"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span className="align-self-center">{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                            className="btn btn-primary btn-lg ms-2"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Editing User */}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editModalLabel">Update User</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedUser && (
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" name="firstName" value={selectedUser.firstName || ''} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" name="lastName" value={selectedUser.lastName || ''} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Age</label>
                                        <input type="number" className="form-control" name="age" value={selectedUser.age || ''} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={selectedUser.email || ''} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Country</label>
                                        <input type="text" className="form-control" name="country" value={selectedUser.country || ''} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Verified</label>
                                        <select
                                            className="form-select"
                                            name="verified"
                                            value={selectedUser.verified}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value={false}>Pending</option>
                                            <option value={true}>Verified</option>
                                        </select>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                        <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersBack;
