import React, { useState, useEffect } from "react";
import $ from "jquery";
import toastr from "toastr";
import ReactQuill from "react-quill";
import { Modal } from "bootstrap";
import BreadCrumb from "@src/components/common/BreadCrumb";
import Loader from "@src/components/common/Loader";
import Api from "@src/lib/services/api";

function Privacy() {
  const [loading, setLoading] = useState(true);
  const [privacy, setPrivacy] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    getPrivacy();
  }, []);

  useEffect(() => {
    $(document).on("hide.bs.modal", "#modalAddEditPrivacy", () => {
      setSelectedPrivacy("");
    });
  }, []);

  const getPrivacy = () => {
    Api.getPrivacy((err, result) => {
      setLoading(false);
      if (
        result &&
        result.data &&
        result.data.success &&
        result.data.privacy &&
        result.data.privacy.value
      )
        setPrivacy(result.data.privacy.value);
    });
  };

  const editPrivacyFn = (event) => {
    event.preventDefault();
    setSelectedPrivacy(privacy);
    new Modal(document.getElementById("modalAddEditPrivacy")).show();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsDisabled(true);
    Api.updatePrivacy({ value: selectedPrivacy.trim() }, (err, result) => {
      setIsDisabled(false);
      if (result && result.data && result.data.success) {
        setPrivacy(selectedPrivacy);
        Modal.getInstance(
          document.getElementById("modalAddEditPrivacy")
        )?.hide();
        return toastr.success("Privacy policy updated successfully");
      } else {
        return toastr.error("Unable to update the privacy policy");
      }
    });
  };

  return (
    <div className="privacy-page">
      <BreadCrumb page={"Privacy policy"} />
      <div className="content">
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-sm-12 text-sm-end">
                <button
                  className="btn btn-primary action-button"
                  onClick={(e) => editPrivacyFn(e)}
                >
                  <i className={`me-2 fa ${privacy ? `fa-edit` : `fa-plus`}`} />
                  {privacy ? "Edit" : "Add"}
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
                privacy && <div dangerouslySetInnerHTML={{ __html: privacy }} className="p-4" />
            )}
          </div>
        </div>
      </div>
      <div
        className="modal fade slide-right action-modal"
        id="modalAddEditPrivacy"
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
                    <label className="form-label">Privacy Policy</label>
                    <ReactQuill
                      theme="snow"
                      value={selectedPrivacy}
                      onChange={(val) => setSelectedPrivacy(val)}
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

export default Privacy;
