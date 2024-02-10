import React, { useState, useEffect, useRef } from "react";
import toastr from "toastr";
import _ from "underscore";
import moment from "moment";
import ReactPaginate from "react-paginate";
import swal from "sweetalert";
import { Modal } from "bootstrap";
import html2pdf from "html2pdf.js";
import BreadCrumb from "@src/components/common/BreadCrumb";
import Loader from "@src/components/common/Loader";
import Api from "@src/lib/services/api";

const Order = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [pagination, setPagination] = useState({ skip: 0, limit: 15 });
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  useEffect(() => {
    document
      .getElementById("modalOrder")
      .addEventListener("hide.bs.modal", function (event) {
        setOrder(null);
      });
  }, []);

  useEffect(() => {
    getOrders();
  }, [pagination]);

  useEffect(() => {
    setPagination({ skip: 0, limit: 15 });
  }, [selectedStatus, searchText, fromDate, toDate]);

  const getOrders = () => {
    const args = {
      skip: pagination.skip,
      limit: pagination.limit,
    };
    if (searchText && searchText.trim()) args["search"] = searchText.trim();
    if (selectedStatus) args["status"] = selectedStatus;
    if (fromDate) {
      const fDate = moment(fromDate).startOf("day").toString();
      args["fromDate"] = fDate;
    }
    if (toDate) {
      const tDate = moment(toDate).endOf("day").toString();
      args["toDate"] = tDate;
    }

    Api.getOrders(args, (err, result) => {
      setLoading(false);
      if (result?.data?.orders) {
        if (!_.isUndefined(result?.data?.totalOrder))
          setTotal(result?.data?.totalOrder);
        setOrders(result?.data?.orders);
      }
    });
  };

  const handlePageClick = (data) => {
    setPagination({
      ...pagination,
      skip: Math.ceil(data.selected * pagination.limit),
    });
  };

  const handleOrder = (event, order) => {
    event.preventDefault();
    if (order && order._id) setOrder(order);
    new Modal(document.getElementById("modalOrder")).show();
  };

  const orderContent = (item) => {
    return `
      <div class="order-data-wrapper">
        <div class="form-group mb-3">
          <label class="fw-bold">User Name</label>
          <div class="ml-1 fs-14">
            ${
              item?.userId?.profile?.firstName +
              " " +
              item?.userId?.profile?.lastName
            }
          </div>
        </div>
        ${
          item?.deliveryAddress
            ? `<div class="form-group mb-3">
            <label class="fw-bold">Delivery Address</label>
            <div class="fs-14 address-text">
              ${item?.deliveryAddress?.name} <br />
              ${item?.deliveryAddress?.address}, ${item?.deliveryAddress?.city} -
              ${item?.deliveryAddress?.zipCode}, ${item?.deliveryAddress?.state} 
              <br />
              ${item?.deliveryAddress?.phone}
            </div>
          </div>`
            : ""
        }
        <div class="form-group mb-3">
          <label class="fw-bold">Date</label>
          <div class="ml-1 fs-14">
            ${moment(item?.createdAt).format("DD MMM YYYY h:mm A")}
          </div>
        </div>
        ${
          item?.products && item?.products.length > 0
            ? `<div class="clearfix">
            <div class="col-sm-12 pt-3 px-0 my-3">
              <div class="clearfix d-flex fw-bold border-bottom pb-2 mb-1">
                <div class="col-sm-4">Product</div>
                <div class="col-sm-2 text-end">Price</div>
                <div class="col-sm-2 text-end">Quantity</div>
                <div class="col-sm-2 text-end">Discount</div>
                <div class="col-sm-2 text-end">Amount</div>
              </div>
              ${item.products
                .map(
                  (product) =>
                    `<div class="clearfix d-flex pt-2 pb-1 fs-14">
                  <div class="col-sm-4 text-truncate">
                    ${product?.name || ""}
                  </div>
                  <div class="col-sm-2 text-end">
                    ₹${product?.price || 0}
                  </div>
                  <div class="col-sm-2 text-end">
                    ${product?.quantity || 0}
                  </div>
                  <div class="col-sm-2 text-end">
                    ₹${product?.discount || 0}
                  </div>
                  <div class="col-sm-2 text-end">
                    ₹${product?.sellPrice || 0}
                  </div>
                </div>`
                )
                .join("")}
              <div class="clearfix d-flex fw-bold border-top pt-3 mt-3 fs-14">
                ${
                  item?.totalDiscount
                    ? `<div class="col-sm-10 text-end">
                    ₹${item.totalDiscount}
                  </div>`
                    : ""
                }
                <div class="col-sm-2 text-end">₹${item.subTotal}</div>
              </div>
              <div class="clearfix d-flex border-bottom pb-3 fw-bold">
                <div class="col-sm-12 pt-3 text-end">
                  Delivery Charge:
                  <span class="fs-14 ms-2">₹${item.deliveryCharge}</span>
                </div>
              </div>
              <div class="clearfix d-flex fw-bold border-bottom pt-3 pb-3">
                <div class="col-sm-12 text-end">
                  Total Price:
                  <span class="fs-14 ms-2">₹${item.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>`
            : ""
        }
      </div>
    `;
  };

  const generateOrderPDF = (event, item, index) => {
    event.preventDefault();
    const element = document.getElementById(`orderPdf${index}`);
    const elementBtn = document.getElementById(`orderPdfBtn${index}`);

    elementBtn.disabled = true;
    element?.classList?.remove("fa-file-pdf-o");
    element?.classList?.add("fa-spinner");

    const orderData = orderContent(item);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = orderData;

    html2pdf()
      .from(tempElement)
      .save()
      .then(() => {
        elementBtn.disabled = false;
        element?.classList?.remove("fa-spinner");
        element?.classList?.add("fa-file-pdf-o");
      });
  };

  const cancelOrderFn = (event, orderId) => {
    event.preventDefault();
    swal({
      title: "Are you sure?",
      text: `You are about to cancel this order.\nThis cannot be undone.`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      html: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        Api.cancelOrder(orderId, (err, result) => {
          if (result && result.data && result.data.success) {
            setOrders(
              [...orders].map((item) =>
                item._id === orderId ? { ...item, status: "cancelled" } : item
              )
            );
            return toastr.success("Order cancelled Successfully");
          } else {
            return toastr.error("Unable to cancel order");
          }
        });
      }
    });
  };

  const deliverOrderFn = (event, orderId) => {
    event.preventDefault();
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      html: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        Api.deliverOrder(orderId, (err, result) => {
          if (result && result.data && result.data.success) {
            setOrders(
              [...orders].map((item) =>
                item._id === orderId ? { ...item, status: "delivered" } : item
              )
            );
            return toastr.success("Order delivered Successfully");
          } else {
            return toastr.error("Unable to deliver order");
          }
        });
      }
    });
  };

  const pageCount = Math.ceil(total / pagination.limit);

  return (
    <div className="order-page">
      <BreadCrumb page={"Orders"} />
      <div className="content">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-sm-6 col-xl-3">
                <div className="search-box-wrapper position-relative">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search here"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <span className="search-icon">
                    <i className="fa fa-search"></i>
                  </span>
                </div>
              </div>
              <div className="col-sm-6 col-xl-2">
                <select
                  name="status"
                  className="form-control"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="" className="py-1">
                    Select Status
                  </option>
                  <option value="placed" className="py-1">
                    Placed
                  </option>
                  <option value="cancelled" className="py-1">
                    Cancelled
                  </option>
                  <option value="delivered" className="py-1">
                    Delivered
                  </option>
                </select>
              </div>
              <div className="col-sm-6 col-xl-2">
                <input
                  ref={fromDateRef}
                  type="text"
                  name="fromDate"
                  className="form-control"
                  placeholder="From Date"
                  onChange={(e) => setFromDate(e.target.value)}
                  onFocus={(e) => (fromDateRef.current.type = "date")}
                  onBlur={(e) =>
                    !fromDate ? (fromDateRef.current.type = "text") : ""
                  }
                />
              </div>
              <div className="col-sm-6 col-xl-2">
                <input
                  ref={toDateRef}
                  type="text"
                  name="toDate"
                  className="form-control"
                  placeholder="To Date"
                  onChange={(e) => setToDate(e.target.value)}
                  onFocus={(e) => (toDateRef.current.type = "date")}
                  onBlur={(e) =>
                    !toDate ? (toDateRef.current.type = "text") : ""
                  }
                />
              </div>
            </div>
          </div>
          <div className="card-body position-relative">
            {loading ? (
              <div className="p-5 m-5 position-relative">
                <Loader />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 data-table">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Price</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th></th>
                      <th width="150"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((item, index) => (
                        <tr key={item._id}>
                          <td>
                            {item?.userId?.profile?.firstName +
                              " " +
                              item?.userId?.profile?.lastName}
                          </td>
                          <td>{item?.userId?.email || ""}</td>
                          <td>₹{item?.totalPrice}</td>
                          <td>
                            {moment(item.createdAt).format(
                              "DD MMM YYYY h:mm A"
                            )}
                          </td>
                          <td
                            className={`text-capitalize fw-500 ${
                              item?.status === "placed"
                                ? "text-warning"
                                : item?.status === "delivered"
                                ? "text-primary"
                                : "text-danger"
                            }`}
                          >
                            {item?.status || ""}
                          </td>
                          <td>
                            {item?.status === "placed" && (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary px-3 py-1 rounded"
                                  onClick={(event) =>
                                    deliverOrderFn(event, item._id)
                                  }
                                >
                                  Delivered
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger px-3 py-1 rounded ms-3"
                                  onClick={(event) =>
                                    cancelOrderFn(event, item._id)
                                  }
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-edit"
                              onClick={(event) => handleOrder(event, item)}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-secondary btn-edit ms-2"
                              onClick={(event) =>
                                generateOrderPDF(event, item, index)
                              }
                              id={`orderPdfBtn${index}`}
                            >
                              <i
                                className="fa fa-file-pdf-o"
                                id={`orderPdf${index}`}
                              ></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No order found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="7">
                        {pageCount > 0 && (
                          <ReactPaginate
                            previousLabel={"← Previous"}
                            nextLabel={"Next →"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                          />
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          <div
            className="modal fade slide-right action-modal"
            id="modalOrder"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-md">
              <div className="modal-content-wrapper">
                <div className="modal-content">
                  <div className="modal-body p-0">
                    <button
                      type="button"
                      className="close"
                      data-bs-dismiss="modal"
                      aria-hidden="true"
                    >
                      <i className="fa fa-times fs-5" />
                    </button>
                    <div
                      dangerouslySetInnerHTML={{ __html: orderContent(order) }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
