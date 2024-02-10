import React, { useState, useEffect } from 'react'
import toastr from 'toastr'
import _ from 'underscore'
import $ from 'jquery'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import ReactQuill from 'react-quill'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import TagsInput from 'react-tagsinput'
import swal from 'sweetalert'
import { Modal } from 'bootstrap'
import BreadCrumb from '@src/components/common/BreadCrumb'
import Loader from '@src/components/common/Loader'
import Api from '@src/lib/services/api'
import FileUpload from '@src/lib/services/fileUpload'

const Product = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState({ _id: '', name: '', categories: [], description: '', price: '', specialPrice: '', photos: [], popular: true, quantity: '', visible: true, location: '', additionalDetails: [] });
    const [images, setImages] = useState([]);
    const [photoList, setPhotoList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isAddEdit, setIsAddEdit] = useState(false);
    const [pagination, setPagination] = useState({ skip: 0, limit: 15 });
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const getData = async () => await getCategories()
        getData()
    }, [])

    useEffect(() => {
        const getData = async () => await getProducts()
        getData()
    }, [pagination])

    useEffect(() => {
        setPagination({ skip: 0, limit: 15 });
    }, [searchText, category])

    useEffect(() => {
        if(isAddEdit) {
            new Modal(document.getElementById('modalAddEditProduct')).show();
            document.getElementById('modalAddEditProduct')?.addEventListener('hide.bs.modal', function (event) {
                $("#productPhotos").val(null)
                cancelFormFn()
            })
        }
    }, [isAddEdit])

    const getCategories = async () => {
        Api.getCategories({}, (err, result) => {
            if (result?.data?.categories) setCategories(result?.data?.categories)
        })
    }

    const getProducts = async () => {
        const args = {
            skip: pagination.skip,
            limit: pagination.limit,
            all: true
        }
        if (searchText && searchText.trim()) args['search'] = searchText.trim()
        if (category) args['categoryId'] = category

        Api.getProducts(args, (err, result) => {
            setLoading(false)
            if (result?.data?.products) {
                if (!_.isUndefined(result?.data?.totalProduct)) setTotal(result?.data?.totalProduct)
                setProducts(result?.data?.products)
            }
        })
    }
    
    const handlePageClick = (data) => {
        setPagination({ ...pagination, skip: Math.ceil(data.selected * pagination.limit) })
    }

    const handleFileChange = (e) => {
        const imageArr = [...images]
        const selectedFiles = Array.from(e.target.files)

        setPhotoList([...photoList, ...selectedFiles])

        if (e.target.files && e.target.files.length > 0) {
            for(var i = 0; i < e.target.files.length; i++) {
                const reader = new FileReader()
                reader.onload = function (event) {
                    imageArr.push(event.target.result)
                    if(e.target.files.length == (imageArr.length - images.length)) setImages(imageArr)
                }
                reader.readAsDataURL(e.target.files[i])
            }
		}
    }

    const removephoto = (e, index, type) => {
        e.preventDefault()
        if(type === 'photos') {
            const photosArr = [...product.photos]
            photosArr.splice(index, 1)
            setProduct({ ...product, photos: photosArr })
        } else {
            const imageArr = [...images]
            const updatedFiles = [...photoList]
            updatedFiles.splice(index, 1)
            imageArr.splice(index, 1)
            setImages([...imageArr])
            setPhotoList([...updatedFiles])
        }
    }

    const cancelFormFn = () => {
        setProduct({ _id: '', name: '', categories: [], description: '', price: '', specialPrice: '', photos: [], popular: true, quantity: '', visible: true, location: '', additionalDetails: [] })
        setImages([])
        setPhotoList([])
        setIsAddEdit(false)
    }

    const deleteProductFn = (event, productId) => {
        event.preventDefault()
        swal({
            title: 'Are you sure?',
            text: `You are about to delete this product.\nThis cannot be undone.`,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            html: true
        }).then((isConfirm) => {
            if (isConfirm) {
                Api.deleteProduct(productId, (err, result) => {
                    if (result && result.data && result.data.success) {
                        setProducts([..._.filter(products, item => item._id !== productId)])
                        setTotal(total - 1)
                        return toastr.success('Product deleted successfully')
                    } else {
                        return toastr.error(err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Unable to delete product')
                    }
                })
            }
        });
    }

    const addEditProductFn = (event, product) => {
        event.preventDefault()
        if (product) setProduct({ _id: product?._id, name: product?.name || '', categories: _.pluck(product?.categories, '_id') || [], description: product?.description || '', price: product?.price || '', specialPrice: product?.specialPrice || '', photos: product?.photos || [], popular: product?.popular || false, quantity: product?.quantity || '', visible: product?.visible || false, location: product?.location || '', additionalDetails: product?.additionalDetails || [] })
        setIsAddEdit(true)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsDisabled(true)

        const data = { ...product }
        if(!product.specialPrice && !product._id) data['specialPrice'] = product.price

        if (product._id) data['productId'] = product._id

        const addEditFn = (inputData) => {
            if (inputData.productId) {
                Api.editProduct(data, (err, result) => {
                    setIsDisabled(false)
                    if (result && result.data && result.data.success) {
                        const categoriesArr = inputData?.categories?.map(categoryId => {
                            const cat = categories?.find(cat => cat?._id === categoryId)
                            return { _id: cat?._id || '', name: cat?.name || '' }
                        }) || []
                        setProducts([...products].map(item => item._id === product._id ? { ...inputData, categories: categoriesArr } : item))
                        Modal.getInstance(document.getElementById('modalAddEditProduct'))?.hide();
                        return toastr.success('Product updated successfully')
                    } else {
                        return toastr.error('Unable to update product')
                    }
                })
            } else {
                Api.addProduct(data, (err, result) => {
                    setIsDisabled(false)
                    if (result && result.data && result.data.data) {
                        const categoriesArr = result?.data?.data?.categories?.map(categoryId => {
                            const cat = categories?.find(cat => cat?._id === categoryId)
                            return { _id: cat?._id || '', name: cat?.name || '' }
                        }) || []
                        setProducts([...products, { ...result.data.data, categories: categoriesArr }])
                        setTotal(total + 1)
                        Modal.getInstance(document.getElementById('modalAddEditProduct'))?.hide();
                        return toastr.success('Product added successfully')
                    } else {
                        return toastr.error('Unable to add product')
                    }
                })
            }
        }

        if (data.photos.length <= 0 && photoList.length <= 0) {
            setIsDisabled(false)
            return toastr.error('please select product photos')
        }

        if (photoList && photoList.length > 0) {
            const photosArr = []
            for(var i = 0; i < photoList.length; i++) {
                FileUpload.fileUpload(photoList[i], (err, res) => {
                    if (err) {
                        setIsDisabled(false)
                        toastr.error('Error in photo upload')
                    } else {
                        photosArr.push(res)
                        if(photosArr.length == photoList.length) {
                            data['photos'] = [...data['photos'], ...photosArr]
                            addEditFn(data)
                        }
                    }
                })
            }
        } else addEditFn(data)
    }

    const handleVisiblityChange = (e, productId) => {
        e.preventDefault()
        const visible = e.target.checked
        Api.editProduct({ productId, visible }, (err, result) => {
            if (result && result.data && result.data.success) {
                setProducts([...products].map(item => item?._id?.toString() === productId?.toString() ? { ...item, visible } : item))
                return toastr.success('Product visibility changed successfully')
            } else {
                return toastr.error('Unable to update product visibility')
            }
        })
    }

    const handlePopularityChange = (e, productId) => {
        e.preventDefault()
        const popular = e.target.checked
        Api.editProduct({ productId, popular }, (err, result) => {
            if (result && result.data && result.data.success) {
                setProducts([...products].map(item => item?._id?.toString() === productId?.toString() ? { ...item, popular } : item))
                return toastr.success('Product popularity changed successfully')
            } else {
                return toastr.error('Unable to update product popularity')
            }
        })
    }

    const handleCategoriesChange = (e) => {
        const productData = { ...product }
        productData['categories'] = Array.from(e.target.selectedOptions).map((option) => option.value)
        setProduct(productData)
    }

    const pageCount = Math.ceil(total / pagination.limit)
    const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY

    return (
        <div className="product-page">
            <BreadCrumb page={'Products'} />
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
                            <div className="col-sm-6 col-xl-3">
                                <select name="categoryIds" className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="" className="py-1">Select Category</option>
                                    {categories.map((category) => { 
                                        return <option key={category._id} name={category.name} value={category._id} className="py-1">{category.name}</option>
                                    })}
                                </select>
                            </div>
                            <div className="col-sm-6 col-xl-6 mt-xl-0 mt-3 text-sm-end">
                                <button className="btn btn-primary action-button" onClick={(event) => addEditProductFn(event)}><i className="fa fa-plus me-2"></i> Add Product</button>
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
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Special Price</th>
                                            <th>Categories</th>
                                            <th>Quantity</th>
                                            <th>Visible</th>
                                            <th>Popular</th>
                                            <th>Created At</th>
                                            <th width="150">&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length > 0 ?
                                            products.map((item) => (
                                                <tr key={item._id}>
                                                    <td>{item.photos && item.photos[0] && <img src={item.photos[0]} alt="Image" className="img-fluid" width="80" />}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.specialPrice}</td>
                                                    <td>{item.categories && item.categories.length > 0 ?
                                                        item.categories.map((category, index) => {
                                                            return (index !== 0 ? ', ' : '') + category.name
                                                        })
                                                        : ''}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" role="switch" checked={item.visible} onChange={e => handleVisiblityChange(e, item._id)} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input className="form-check-input" type="checkbox" role="switch" checked={item.popular} onChange={e => handlePopularityChange(e, item._id)} />
                                                        </div>
                                                    </td>
                                                    <td>{moment(item.createdAt).format('DD MMM YYYY h:mm A')}</td>
                                                    <td>
                                                        <button className="btn btn-primary btn-edit" onClick={(event) => addEditProductFn(event, item)}><i className="fa fa-pencil"></i></button>
                                                        <button className="btn btn-primary btn-remove" onClick={(event) => deleteProductFn(event, item._id)}><i className="fa fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan="10" className="text-center">No product found</td>
                                            </tr>
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="10">
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
                    {isAddEdit &&
                        <div className="modal fade slide-right action-modal" id="modalAddEditProduct" tabIndex="-1" role="dialog" aria-hidden="true">
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
                                                    <label className="form-label">Name</label>
                                                    <input type="text" className="form-control" name="name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} placeholder="Enter Name" required />
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Photos</label>
                                                    <input type="file" className="d-block w-100 custom-file-upload" name="image" onChange={handleFileChange} id="productPhotos" accept="image/*" multiple />
                                                    <div className="d-flex flex-wrap mt-4">
                                                        {(product.photos && product.photos.length > 0) && 
                                                            product.photos.map((photo, index) => (
                                                                <div className="position-relative me-4 mb-4" key={index}>
                                                                    <img src={photo} alt="Image" className="img-fluid" width="80" />
                                                                    <span className="ml-1 icon-remove" onClick={e => removephoto(e, index, 'photos')}>
                                                                        <i className="fa fa-times pointer text-danger" />
                                                                    </span>
                                                                </div>
                                                            ))
                                                        }
                                                        {(images && images.length > 0) &&
                                                            images.map((image, index) => (
                                                                <div className="position-relative me-4 mb-4" key={index}>
                                                                    <img src={image} alt="Image" className="img-fluid" width="80" />
                                                                    <span className="ml-1 icon-remove" onClick={e => removephoto(e, index, 'images')}>
                                                                        <i className="fa fa-times pointer text-danger" />
                                                                    </span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-group mb-4">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <label className="form-label">Price</label>
                                                            <input type="number" name="price" className="form-control mb-4 mb-sm-0" placeholder="Price" onChange={(e) => setProduct({ ...product, price: e.target.value })} value={product.price} min="0" required />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label">Special Price</label>
                                                            <input type="number" name="specialPrice" className="form-control" placeholder="Special Price" onChange={(e) => setProduct({ ...product, specialPrice: e.target.value })} value={product.specialPrice} min="0" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Quantity</label>
                                                    <input type="number" name="quantity" className="form-control mb-4 mb-sm-0" placeholder="Quantity" onChange={(e) => setProduct({ ...product, quantity: e.target.value })} value={product.quantity} min="1" required />
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Categories</label>
                                                    <div className="select-outer">
                                                        <select name="categoryIds" className="form-control overflow-auto category-select" value={product.categories} onChange={e => handleCategoriesChange(e)} style={{ height: 150 }} multiple required>
                                                            {categories.map((category) => {
                                                                return <option key={category._id} name={category.name} value={category._id} className="py-1">{category.name}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Description</label>
                                                    <ReactQuill
                                                        theme="snow"
                                                        defaultValue={product.description}
                                                        onChange={val => setProduct({ ...product, description: val })}
                                                        modules={{
                                                            toolbar: [
                                                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                ['bold', 'italic', 'underline'],
                                                                [{ 'color': [] }, { 'background': [] }],
                                                                [{ 'size': ['small', false, 'large', 'huge'] }],
                                                            ]
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Location</label>
                                                    <GooglePlacesAutocomplete
                                                        apiKey={googleApiKey}
                                                        selectProps={{
                                                            defaultInputValue: product.location,
                                                            onChange: val => setProduct({ ...product, location: val?.label })
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Additional Details</label>
                                                    <TagsInput
                                                        inputProps={{ placeholder: 'Enter detail and press enter' }}
                                                        value={product?.additionalDetails || []}
                                                        onChange={val => setProduct({ ...product, additionalDetails: val })}
                                                    />
                                                </div>
                                                <div className="form-group mb-4">
                                                    <label className="form-label">Visible</label>
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" role="switch" checked={product.visible} onChange={e => setProduct({ ...product, visible: e.target.checked })} />
                                                    </div>
                                                </div>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value="" id="popular" checked={product.popular} onChange={e => setProduct({ ...product, popular: e.target.checked })} />
                                                    <label className="form-check-label form-label" htmlFor="popular">Popular</label>
                                                </div>
                                                <button type="submit" className="btn btn-primary btn-action float-end" disabled={isDisabled}>Save</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Product;