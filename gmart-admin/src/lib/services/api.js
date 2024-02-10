import axios from "axios";
import { getToken, clearToken, history } from "../helpers/utility";

const webAPIHost = process.env.REACT_APP_WEB_API_HOST;

function getAPIHeader() {
  const token = getToken();
  return {
    headers: {
      authorization: token,
    },
  };
}

function unauthorizedHandleFn() {
  clearToken();
  history?.navigate?.("/login");
}

const Api = {
  login: (data, cb) => {
    const url = webAPIHost + "/public/authUser";
    axios
      .post(url, data)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        cb(error, null);
      });
  },
  getUsers: (data, cb) => {
    const url = webAPIHost + "/api/getUsers";
    const options = getAPIHeader();
    axios
      .get(url, { ...options, params: data })
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  editUser: (data, cb) => {
    const url = webAPIHost + "/api/editUser/" + data?.userId;
    const options = getAPIHeader();
    axios
      .put(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  deleteUser: (userId, cb) => {
    const url = webAPIHost + "/api/deleteUser/" + userId;
    const options = getAPIHeader();
    axios
      .delete(url, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getCategories: (data, cb) => {
    const url = webAPIHost + "/public/getCategories";
    const options = getAPIHeader();
    axios
      .get(url, { ...options, params: data })
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  deleteCategory: (categoryId, cb) => {
    const url = webAPIHost + "/api/deleteCategory/" + categoryId;
    const options = getAPIHeader();
    axios
      .delete(url, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  addCategory: (data, cb) => {
    const url = webAPIHost + "/api/addCategory";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  editCategory: (data, cb) => {
    const url = webAPIHost + "/api/editCategory/" + data?.categoryId;
    const options = getAPIHeader();
    axios
      .put(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getProducts: (data, cb) => {
    const url = webAPIHost + "/public/getProducts";
    const options = getAPIHeader();
    axios
      .get(url, { ...options, params: data })
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  deleteProduct: (productId, cb) => {
    const url = webAPIHost + "/api/deleteProduct/" + productId;
    const options = getAPIHeader();
    axios
      .delete(url, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  addProduct: (data, cb) => {
    const url = webAPIHost + "/api/addProduct";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  editProduct: (data, cb) => {
    const url = webAPIHost + "/api/editProduct/" + data?.productId;
    const options = getAPIHeader();
    axios
      .put(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getBanners: (data, cb) => {
    const url = webAPIHost + "/public/getBanners";
    const options = getAPIHeader();
    axios
      .get(url, { ...options, params: data })
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  deleteBanner: (bannerId, cb) => {
    const url = webAPIHost + "/api/deleteBanner/" + bannerId;
    const options = getAPIHeader();
    axios
      .delete(url, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  addBanner: (data, cb) => {
    const url = webAPIHost + "/api/addBanner";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  editBanner: (data, cb) => {
    const url = webAPIHost + "/api/editBanner/" + data?.bannerId;
    const options = getAPIHeader();
    axios
      .put(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getOrders: (data, cb) => {
    const url = webAPIHost + "/api/getOrders";
    const options = getAPIHeader();
    axios
      .get(url, { ...options, params: data })
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  cancelOrder: (orderId, cb) => {
    const url = webAPIHost + "/api/cancelOrder/" + orderId;
    const options = getAPIHeader();
    axios
      .post(url, {}, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  deliverOrder: (orderId, cb) => {
    const url = webAPIHost + "/api/deliverOrder/" + orderId;
    const options = getAPIHeader();
    axios
      .post(url, {}, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getPrivacy: (cb) => {
    const url = webAPIHost + "/public/getPrivacy";
    axios
      .get(url)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  updatePrivacy: (data, cb) => {
    const url = webAPIHost + "/api/updatePrivacy";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getTerms: (cb) => {
    const url = webAPIHost + "/public/getTerms";
    axios
      .get(url)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  updateTerms: (data, cb) => {
    const url = webAPIHost + "/api/updateTerms";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  setDeliveryLimit: (data, cb) => {
    const url = webAPIHost + "/api/setDeliveryLimit";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  setDeliveryCharge: (data, cb) => {
    const url = webAPIHost + "/api/setDeliveryCharge";
    const options = getAPIHeader();
    axios
      .post(url, data, options)
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  },
  getDashboardData: (cb) => {
    const url = webAPIHost + "/api/getDashboardData";
    const options = getAPIHeader();
    axios
      .get(url, { ...options })
      .then((result) => {
        cb(null, result);
      })
      .catch((error) => {
        if (
          error &&
          error.response &&
          error.response.status &&
          error.response.status === 401
        )
          unauthorizedHandleFn();
        cb(error, null);
      });
  }
};

export default Api;
