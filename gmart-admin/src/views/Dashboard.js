import React, { useState, useEffect } from "react";
import _ from "underscore";
import toastr from "toastr";
import BreadCrumb from "@src/components/common/BreadCrumb";
import Loader from "@src/components/common/Loader";
import Api from "@src/lib/services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([
    {
      label: "Free Order Delivery Limit",
      key: "deliveryLimit",
      value: 0,
      newValue: 0,
      isEdit: false,
      isEditable: true
    },
    {
      label: "Delivery Charge",
      key: "deliveryCharge",
      value: 0,
      newValue: 0,
      isEdit: false,
      isEditable: true
    },
    {
      label: "Today's Order",
      key: "todayOrder",
      value: 0,
      isEditable: false
    },
    {
      label: "This Month Order",
      key: "monthOrder",
      value: 0,
      isEditable: false
    },
    {
      label: "This Month Income",
      key: "monthOrderTotal",
      value: 0,
      isEditable: false
    },
  ]);

  useEffect(() => {
    Api.getDashboardData((err, result) => {
      setLoading(false);
      if (result?.data?.dashboardData) {
        const itemList = [...data]
        itemList?.map(item => {
          item['value'] = result?.data?.dashboardData?.[item.key] || 0  
          item['newValue'] = result?.data?.dashboardData?.[item.key] || 0  
        })
        setData([...itemList])
      }
    });
  }, []);

  const handleChange = (key, field, value) => {
    setData(
      [...data].map((d) => (d.key === key ? { ...d, [field]: value } : d))
    );
  };

  const onCancel = (key) => {
    setData(
      [...data].map((d) =>
        d.key === key ? { ...d, isEdit: false, newValue: d.value } : d
      )
    );
  };

  const handleSubmit = (e, key, value) => {
    e.preventDefault();
    if (key === "deliveryLimit") {
      Api.setDeliveryLimit({ value }, (err, result) => {
        if (result && result.data && result.data.success) {
          setData(
            [...data].map((d) =>
              d.key === key
                ? { ...d, value, newValue: value, isEdit: false }
                : d
            )
          );
          return toastr.success("Delivery limit updated successfully");
        } else {
          return toastr.error("Unable to update delivery limit");
        }
      });
    } else {
      Api.setDeliveryCharge({ value }, (err, result) => {
        if (result && result.data && result.data.success) {
          setData(
            [...data].map((d) =>
              d.key === key
                ? { ...d, value, newValue: value, isEdit: false }
                : d
            )
          );
          return toastr.success("Delivery limit updated successfully");
        } else {
          return toastr.error("Unable to update delivery limit");
        }
      });
    }
  };

  return (
    <div className="category-page">
      <BreadCrumb page={"Dashboard"} />
      <div className="content" id="dashboardContent">
        <div>
          <div className="card-body position-relative">
            {loading ? (
              <div className="p-5 m-5 position-relative">
                <Loader />
              </div>
            ) : (
              <div className="row">
                {data.map((item, index) => (
                  <div className="col-xl-4 col-sm-6" key={index}>
                    <div className="card py-4">
                      <div className="">
                        {(item.isEditable && !item.isEdit) && (
                          <span
                            className="text-black float-end pointer"
                            onClick={() => handleChange(item.key, "isEdit", true)}
                          >
                            <i className="fa fa-pencil"></i>
                          </span>
                        )}
                        <span className="fw-500 text-black">{item.label}</span>
                        {!item.isEdit && (
                          <h4 className="fw-bold fs-6 mt-2 mb-0 text-black">
                            {(item.key === 'deliveryLimit' || item.key === 'deliveryCharge' || item.key === 'monthOrderTotal') && '₹'}{item.value}
                          </h4>
                        )}
                      </div>
                      {(item.isEditable && item.isEdit) && (
                        <div className="pt-2">
                          <form className="d-flex">
                            <input
                              type="number"
                              value={item.newValue}
                              onChange={(e) =>
                                handleChange(
                                  item.key,
                                  "newValue",
                                  e.target.value
                                )
                              }
                              className="form-control"
                              id="txtDeliveryLimit"
                              min="1"
                            />
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary ms-2"
                              onClick={(e) =>
                                handleSubmit(e, item.key, item.newValue)
                              }
                            >
                              <i className="fa fa-check"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm ms-2"
                              onClick={() => onCancel(item.key)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
