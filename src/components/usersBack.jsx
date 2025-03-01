import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersBack = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/usersBack?page=${currentPage}&limit=${itemsPerPage}`
      );
      const { users, totalPages, totalUsers } = response.data;
      setUsers(users);
      setTotalPages(totalPages);
      setTotalUsers(totalUsers);
    } catch (err) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  const handleUserEdit = (user) => {
    setSelectedUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/usersBack/${selectedUser._id}`,
        selectedUser
      );
      fetchUsers();
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/usersBack/${userId}`);
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="card shadow-lg p-4">
        <h2 className="mb-4 text-center">Users Management</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered fs-5">
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.verified ? "bg-success" : "bg-warning"
                          }`}
                        >
                          {user.verified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => handleUserEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-primary me-2"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span className="align-self-center">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className="btn btn-primary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Editing User */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update User
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedUser && (
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={selectedUser.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="verified" className="form-label">
                      Verified
                    </label>
                    <select
                      className="form-select"
                      id="verified"
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
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                    <button
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
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
