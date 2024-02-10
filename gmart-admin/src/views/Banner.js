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
import FileUpload from '@src/lib/services/fileUpload'

const Banner = () => {
    const [loading, setLoading] = useState(true);
    const [banners, setBanners] = useState([]);
    const [banner, setBanner] = useState({ _id: '', title: '', photo: '', visible: true });
    const [isDisabled, setIsDisabled] = useState(false);
    const [pagination, setPagination] = useState({ skip: 0, limit: 15 });
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        document.getElementById('modalAddEditBanner').addEventListener('hide.bs.modal', function (event) {
            $("#bannerPhoto").val(null)
            cancelFormFn()
        })
    }, [])

    useEffect(() => {
        getBanners()
    }, [pagination])

    useEffect(() => {
        setPagination({ skip: 0, limit: 15 })
    }, [searchText])

    const getBanners = () => {
        const args = {
            skip: pagination.skip,
            limit: pagination.limit,
            all: true
        }
        if (searchText && searchText.trim()) args['search'] = searchText.trim()

        Api.getBanners(args, (err, result) => {
            setLoading(false)
            if (result?.data?.banners) {
                if (!_.isUndefined(result?.data?.totalBanner)) setTotal(result?.data?.totalBanner)
                setBanners(result?.data?.banners)
            }
        })
    }

    const handlePageClick = (data) => {
        setPagination({ ...pagination, skip: Math.ceil(data.selected * pagination.limit) })
    }

    const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader()
			reader.onload = function(event) {
                setBanner({ ...banner, photo: event.target.result })
			}
			reader.readAsDataURL(e.target.files[0])
		}
	}

	const removephoto = (e) => {
		e.preventDefault()
		$('#bannerPhoto').val('')
        setBanner({ ...banner, photo: '' })
	}

    const cancelFormFn = () => {
        setBanner({ _id: '', title: '', photo: '', visible: true })
    }

    const deleteBannerFn = (event, bannerId) => {
        event.preventDefault()
        swal({
            title: 'Are you sure?',
            text: `You are about to delete this banner.\nThis cannot be undone.`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            html: true
        }).then((isConfirm) => {
            if (isConfirm) {
                Api.deleteBanner(bannerId, (err, result) => {
                    if (result && result.data && result.data.success) {
                        setBanners([..._.filter(banners, item => item._id !== bannerId)])
                        setTotal(total - 1)
                        return toastr.success('Banner deleted successfully')
                    } else {
                        return toastr.error(err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Unable to delete banner')
                    }
                })
            }
        });
    }

    const handleVisiblityChange = (e, bannerId) => {
        e.preventDefault()
        const visible = e.target.checked
        Api.editBanner({ bannerId, visible }, (err, result) => {
            if (result && result.data && result.data.success) {
                setBanners([...banners].map(item => item?._id?.toString() === bannerId?.toString() ? { ...item, visible } : item))
                return toastr.success('Banner visibility changed successfully')
            } else {
                return toastr.error('Unable to update banner visibility')
            }
        })
    }

    const addEditBannerFn = (event, banner) => {
        event.preventDefault()
        if(banner) setBanner({ _id: banner?._id, title: banner?.title || '', photo: banner?.photo || '', visible: banner?.visible || false })
		new Modal(document.getElementById('modalAddEditBanner')).show();
    }

   const handleSubmit = (event) => {
		event.preventDefault()
        setIsDisabled(true)

        const data = { ...banner }
		
        if(banner._id) data['bannerId'] = banner._id

        const addEditFn = (inputData) => {
            if(inputData.bannerId) {
                Api.editBanner(data, (err, result) => {
                    setIsDisabled(false)
                    if(result && result.data && result.data.success) {
                        setBanners([...banners].map(item => item._id === banner._id ? { ...inputData } : item))
                        Modal.getInstance(document.getElementById('modalAddEditBanner'))?.hide();
                        return toastr.success('Banner updated successfully')
                    } else {
                        return toastr.error('Unable to update banner')
                    }
                })
            } else {
                Api.addBanner(data, (err, result) => {
                    setIsDisabled(false)
                    if(result && result.data && result.data.data) {
                        setBanners([...banners, result.data.data])
                        setTotal(total + 1)
                        Modal.getInstance(document.getElementById('modalAddEditBanner'))?.hide();
                        return toastr.success('Banner added successfully')
                    } else {
                        return toastr.error('Unable to add banner')
                    }
                })
            }
        }

        if(!data.photo && document.getElementById('bannerPhoto')?.files?.length <= 0) {
            setIsDisabled(false)
            return toastr.error('please select banner photo')
        }

        if(document.getElementById('bannerPhoto') && document.getElementById('bannerPhoto').files && document.getElementById('bannerPhoto').files[0]) {
            FileUpload.fileUpload(document.getElementById('bannerPhoto').files[0], (err, res) => {
                if (err) {
                    setIsDisabled(false)
                    toastr.error('Error in photo upload')
                } else {
                    data['photo'] = res
                    addEditFn(data)
                }
            })
        } else addEditFn(data)
    }

    const pageCount = Math.ceil(total / pagination.limit)
    
    return (
        <div className="banner-page">
            <BreadCrumb page={'Banners'} />
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
                            <div className="col-sm-6 col-xl-9 mt-xl-0 mt-3 text-sm-end">
                                <button className="btn btn-primary action-button" onClick={(event) => addEditBannerFn(event)}><i className="fa fa-plus me-2"></i> Add Banner</button>
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
                                            <th>Photo</th>
                                            <th>Title</th>
                                            <th>Visible</th>
                                            <th>Created At</th>
                                            <th width="150">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {banners.length > 0 ?
                                            banners.map((item) => (
                                                <tr key={item._id}>
                                                    <td><img src={item.photo} alt="Image" className="img-fluid" width="80" /></td>
                                                    <td>{item.title}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" role="switch" checked={item.visible} onChange={e => handleVisiblityChange(e, item._id)} />
                                                        </div>
                                                    </td>
                                                    <td>{moment(item.createdAt).format('DD MMM YYYY h:mm A')}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-edit" onClick={(event) => addEditBannerFn(event, item)}><i className="fa fa-pencil"></i></button>
                                                        <button className="btn btn-primary btn-remove" onClick={(event) => deleteBannerFn(event, item._id)}><i className="fa fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan="5" className="text-center">No banner found</td>
                                            </tr>
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="5">
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
                    <div className="modal fade slide-right action-modal" id="modalAddEditBanner" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                                <label className="form-label">Title</label>
                                                <input type="text" className="form-control" name="title" value={banner.title} onChange={(e) => setBanner({ ...banner, title: e.target.value })} placeholder="Enter Title" required />
                                            </div>
                                            <div className="form-group mb-4">
                                                <label className="form-label">Photo</label>
                                                <input type="file" className="d-block w-100" name="image" onChange={handleFileChange} id="bannerPhoto" accept="image/*" />
                                                {banner.photo && (
                                                    <div className="position-relative mt-4">
                                                        <img src={banner.photo} alt="Image" className="img-fluid" width="80" />
                                                        <span className="ml-1 icon-remove" onClick={removephoto}>
                                                            <i className="fa fa-times pointer text-danger" />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="form-group mb-4">
                                                <label className="form-label">Visible</label>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" role="switch" checked={banner.visible} onChange={e => setBanner({ ...banner, visible: e.target.checked })} />
                                                </div>
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
 
export default Banner;