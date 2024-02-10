import React, { useState, useEffect } from 'react'
import toastr from 'toastr'
import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import swal from 'sweetalert'
import { Modal } from 'bootstrap'
import BreadCrumb from '@src/components/common/BreadCrumb'
import Loader from '@src/components/common/Loader'
import Api from '@src/lib/services/api'

const User = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({ _id: '', firstName: '', lastName: '', email: '', phone: '' });
    const [isDisabled, setIsDisabled] = useState(false);
    const [pagination, setPagination] = useState({ skip: 0, limit: 15 });
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        document.getElementById('modalEditUser').addEventListener('hide.bs.modal', function (event) {
            $("#userPhoto").val(null)
            cancelFormFn()
        })
    }, [])

    useEffect(() => {
        getUsers()
    }, [pagination])


    useEffect(() => {
        setPagination({ skip: 0, limit: 15 })
    }, [searchText])

    const getUsers = () => {
        const args = {
            skip: pagination.skip,
            limit: pagination.limit
        }
        if (searchText && searchText.trim()) args['search'] = searchText.trim()
        Api.getUsers(args, (err, result) => {
            setLoading(false)
            if (result?.data?.users) {
                if (!_.isUndefined(result?.data?.totalUser)) setTotal(result?.data?.totalUser)
                setUsers(result?.data?.users)
            }
        })
    }

    const handlePageClick = (data) => {
        setPagination({ ...pagination, skip: Math.ceil(data.selected * pagination.limit) })
    }

    const cancelFormFn = () => {
        setUser({ _id: '', firstName: '', lastName: '', email: '', phone: '' })
    }

    const deleteUserFn = (event, userId) => {
        event.preventDefault()
        swal({
            title: 'Are you sure?',
            text: `You are about to delete this user.\nThis cannot be undone.`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            html: true
        }).then((isConfirm) => {
            if (isConfirm) {
                Api.deleteUser(userId, (err, result) => {
                    if (result && result.data && result.data.success) {
                        setUsers([..._.filter(users, item => item._id !== userId)])
                        setTotal(total - 1)
                        return toastr.success('User deleted successfully')
                    } else {
                        return toastr.error(err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Unable to delete user')
                    }
                })
            }
        });
    }

    const editUserFn = (event, user) => {
        event.preventDefault()
        if(user) setUser({ _id: user?._id, firstName: user?.profile?.firstName || '', lastName: user?.profile?.lastName || '', email: user?.email || '', phone: user?.phone || '' })
		new Modal(document.getElementById('modalEditUser')).show();
    }

   const handleSubmit = (event) => {
		event.preventDefault()
        setIsDisabled(true)

        const data = { ...user, userId: user._id }
        Api.editUser(data, (err, result) => {
            setIsDisabled(false)
            if(result && result.data && result.data.success) {
                setUsers([...users].map(item => item._id === data._id ? { ...item, profile: { firstName: data?.firstName || '', lastName: data?.lastName || '' }, email: data?.email || '', phone: data?.phone || '' } : item ))
                Modal.getInstance(document.getElementById('modalEditUser'))?.hide();
                return toastr.success('User updated successfully')
            } else {
                return toastr.error('Unable to update user')
            }
        })
    }

    const pageCount = Math.ceil(total / pagination.limit)
    
    return (
        <div className="user-page">
            <BreadCrumb page={'Users'} />
            <div className="content">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-sm-6 col-xl-3">
                                <div className="search-box-wrapper position-relative">
                                    <input type="text" className="form-control search-input" placeholder="Search here" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                                    <span className="search-icon"><i className="fa fa-search"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body position-relative">
                        {loading ?
                            <div className="p-5 m-5 position-relative">
                                <Loader />
                            </div>
                            :
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 data-table">
                                    <thead>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Created At</th>
                                            <th width="150">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ?
                                            users.map((item) => (
                                                <tr key={item._id}>
                                                    <td>{item?.profile?.firstName}</td>
                                                    <td>{item?.profile?.lastName}</td>
                                                    <td>{item?.email}</td>
                                                    <td>{item?.phone}</td>
                                                    <td>{moment(item.createdAt).format('DD MMM YYYY h:mm A')}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-edit" onClick={(event) => editUserFn(event, item)}><i className="fa fa-pencil"></i></button>
                                                        {(item?.role && item?.role !== 'admin') && <button className="btn btn-primary btn-remove" onClick={(event) => deleteUserFn(event, item._id)}><i className="fa fa-trash"></i></button>}
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan="6" className="text-center">No user found</td>
                                            </tr>
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="6">
                                                {pageCount > 0 &&
                                                    <ReactPaginate
                                                        previousLabel={"← Previous"}
                                                        nextLabel={"Next →"}
                                                        breakLabel={'...'}
                                                        pageCount={pageCount}
                                                        marginPagesDisplayed={2}
                                                        pageRangeDisplayed={5}
                                                        onPageChange={handlePageClick}
                                                        containerClassName={'pagination'}
                                                    />
                                                }
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        }
                    </div>
                    <div className="modal fade slide-right action-modal" id="modalEditUser" tabIndex="-1" role="dialog" aria-hidden="true">
                        {isDisabled &&
                            <div className="modal-loading">
                                <i className="fa fa-spinner fa-spin fa-2x"></i>
                            </div>
                        }
                        <div className="modal-dialog modal-md">
                            <div className="modal-content-wrapper">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <button type="button" className="close" data-bs-dismiss="modal" aria-hidden="true">
                                            <i className="fa fa-times fs-5" />
                                        </button>
                                        <form className="clearfix text-start" onSubmit={(event) => handleSubmit(event)}>
                                            <div className="form-group mb-4">
                                                <label className="form-label">First Name</label>
                                                <input type="text" className="form-control" name="firstName" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} placeholder="Enter First Name" required />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label className="form-label">Last Name</label>
                                                <input type="text" className="form-control" name="lastName" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} placeholder="Enter Last Name" required />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label className="form-label">Email</label>
                                                <input type="email" className="form-control" name="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Enter Email" required />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label className="form-label">Phone</label>
                                                <input type="text" className="form-control" name="phone" minLength={10} maxLength={10} value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="Enter Phone" required />
                                            </div>
                                            <button type="submit" className="btn btn-primary btn-action float-end" disabled={isDisabled}>Save</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default User;