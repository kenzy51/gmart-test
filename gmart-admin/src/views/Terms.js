import React, { useState, useEffect } from "react";
import $ from "jquery";
import toastr from "toastr";
import ReactQuill from "react-quill";
import { Modal } from "bootstrap";
import BreadCrumb from "@src/components/common/BreadCrumb";
import Loader from "@src/components/common/Loader";
import Api from "@src/lib/services/api";

function Terms() {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState("");
  const [selectedTerms, setSelectedTerms] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    getTerms();
  }, []);

  useEffect(() => {
    $(document).on("hide.bs.modal", "#modalAddEditTerms", () => {
      setSelectedTerms("");
    });
  }, []);

  const getTerms = () => {
    Api.getTerms((err, result) => {
      setLoading(false);
      if (
        result &&
        result.data &&
        result.data.success &&
        result.data.terms &&
        result.data.terms.value
      )
        setTerms(result.data.terms.value);
    });
  };

  const editTermsFn = (event) => {
    event.preventDefault();
    setSelectedTerms(terms);
    new Modal(document.getElementById("modalAddEditTerms")).show();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsDisabled(true);
    Api.updateTerms({ value: selectedTerms.trim() }, (err, result) => {
      setIsDisabled(false);
      if (result && result.data && result.data.success) {
        setTerms(selectedTerms);
        Modal.getInstance(
          document.getElementById("modalAddEditTerms")
        )?.hide();
        return toastr.success("Terms updated successfully");
      } else {
        return toastr.error("Unable to update the terms");
      }
    });
  };

  return (
    <div className="terms-page">
      <BreadCrumb page={"Terms"} />
      <div className="content">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-sm-12 text-sm-end">
                <button
                  className="btn btn-primary action-button"
                  onClick={(e) => editTermsFn(e)}
                >
                  <i className={`me-2 fa ${terms ? `fa-edit` : `fa-plus`}`} />
                  {terms ? "Edit" : "Add"}
                </button>
              </div>
            </div>
          </div>
          <div className="card-body position-relative">
            {loading ? (
              <div className="p-5">
                <Loader />
              </div>
            ) : (
                terms && <div dangerouslySetInnerHTML={{ __html: terms }} className="p-4" />
            )}
          </div>
        </div>
      </div>
      <div
        className="modal fade slide-right action-modal"
        id="modalAddEditTerms"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        {isDisabled && (
          <div className="modal-loading">
            <i className="fa fa-spinner fa-spin fa-2x" />
          </div>
        )}
        <div className="modal-dialog modal-md">
          <div className="modal-content-wrapper">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  <i className="fa fa-times fs-5" />
                </button>
                <form
                  className="clearfix text-left"
                  onSubmit={(event) => handleSubmit(event)}
                >
                  <div className="form-group mb-4">
                    <label className="form-label">Terms</label>
                    <ReactQuill
                      theme="snow"
                      value={selectedTerms}
                      onChange={(val) => setSelectedTerms(val)}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }, { font: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["bold", "italic", "underline"],
                          [{ color: [] }, { background: [] }],
                          [{ size: ["small", false, "large", "huge"] }],
                        ],
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-action float-end"
                    disabled={isDisabled}
                  >
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;
