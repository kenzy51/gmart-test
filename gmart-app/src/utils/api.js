import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeToken} from '../components/redux/actions';
import {setTempUserId} from '../components/redux/actions';
import store from '../components/redux/store';
const APIHost = config.apiUrl;

async function getAPIHeader() {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: token,
    },
  };
}

async function getAPIHeaderMultipart(_boundary) {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${_boundary}`,
      Accept: 'application/json',
      authorization: token,
    },
  };
}

async function unauthorizedHandleFn() {
  await AsyncStorage.removeItem('token');
  store.dispatch(removeToken());
  Api.getTempUserId({}, async (err, result) => {
    const tempUserId = result?.data?.userId;
    if (result && result?.data && result?.data?.userId) {
      store.dispatch(setTempUserId(tempUserId));
    }
  });
}

const Api = {
  getBanners: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getBanners', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },

  getCategories: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getCategories', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error.null);
      });
  },

  getProducts: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getProducts', {...option, params: data})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error.null);
      });
  },

  getProductDetails: async (productId, cb) => {
    const option = getAPIHeader();
    return axios
      .get(APIHost + `public/getProductDetails/${productId}`, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error.null);
      });
  },
  authUser: async (data, cb) => {
    const option = getAPIHeader();
    return axios
      .post(APIHost + 'public/authUser', data, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  getTempUserId: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getTempUserId', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  updateCart: async (userId, data, cb) => {
    const option = await getAPIHeader();
    return axios
      .put(APIHost + `public/updateCart/${userId}`, data, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
        console.log('r1111', error?.response, error?.response?.data);
      });
  },

  getUserDetail: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'api/getUserDetail', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
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

  getCart: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getCart', {...option, params: data})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },

  addAddress: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .post(APIHost + 'api/addAddress', data, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  editAddress: async (addressId, cb) => {
    const option = await getAPIHeader();
    return axios
      .put(APIHost + `api/editAddress/${addressId}`, {}, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },

  getUserAddresses: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'api/getUserAddresses', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  deleteAddress: async (addresId, cb) => {
    const option = await getAPIHeader();
    return axios
      .delete(APIHost + `api/deleteAddress/${addresId}`, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  createRazorPayOrder: async cb => {
    const option = await getAPIHeader();
    return axios
      .post(APIHost + 'api/createRazorPayOrder', {}, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  placeOrder: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .post(APIHost + 'api/placeOrder', data, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  getWishlistProducts: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'api/getWishlistProducts', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  wishlistProduct: async (data, cb) => {
    const option = await getAPIHeader();
    return axios
      .post(APIHost + 'api/wishlistProduct', data, option)
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  editUser: async (data, cb) => {
    const options = await getAPIHeader();
    return axios
      .put(APIHost + 'api/editUser', data, options)
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  getOrders: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'api/getOrders', option)
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  cancelOrder: async (orderId, cb) => {
    const option = await getAPIHeader();
    return axios
      .post(APIHost + `api/cancelOrder/${orderId}`, {}, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  addUser: async (data, cb) => {
    return axios
      .post(APIHost + 'public/addUser', data)
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  getTerms: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getTerms', option)
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },
  getPrivacy: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getPrivacy', option)
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },

  addShop: async (data, cb) => {
    const option = await getAPIHeader();
    //const option = await getAPIHeader();
    // api/addShop should be, for testing purpose it is in public
    return axios
      .post(APIHost + 'api/addShop', data, {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        cb(error, null);
      });
  },

  addManufacturer: async (data, cb) => {
    const option = await getAPIHeader();
    console.log('Before request post');
    //const option = await getAPIHeader();
    // api/addShop should be, for testing purpose it is in public
    return axios
      .post(APIHost + 'api/addManufacturer', data, {...option})
      .then(response => {
        console.log('Success request post');
        cb(null, response);
      })
      .catch(error => {
        console.log('Error request post: ' + error);
        cb(error, null);
      });
  },

  addProduct: async (data, cb) => {
    const option = await getAPIHeader();
    console.log('Before request post product');
    //const option = await getAPIHeader();
    // api/addShop should be, for testing purpose it is in public
    return axios
      .post(APIHost + 'public/addProduct', data, {...option})
      .then(response => {
        console.log('Success request post');
        cb(null, response);
      })
      .catch(error => {
        console.log('Error request post: ' + error);
        cb(error, null);
      });
  },

  addRequest: async (data, cb) => {
    const option = await getAPIHeader();
    console.log('Before request post productssss');
    return axios
      .post(APIHost + 'public/addRequest', data, {...option})
      .then(response => {
        console.log('Success request post');
        cb(null, response);
      })
      .catch(error => {
        console.log('Error request post: ' + error);
        cb(error, null);
      });
  },

  getShops: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getShops', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        console.log(error.message);
        cb(error, null);
      });
  },

  getKeywords: async cb => {
    const option = await getAPIHeader();
    return axios
      .get(APIHost + 'public/getKeywords', {...option})
      .then(response => {
        cb(null, response);
      })
      .catch(error => {
        console.log('real error');
        cb(error, null);
      });
  },
};

export default Api;
