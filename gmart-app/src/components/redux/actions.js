import Api from "../../utils/api";

export const getBanner = () => async (dispatch) => {
  Api.getBanners({}, async (err, result) => {
    console.log('jsggv', result)
    console.log('jsggv23', err)
    if (result && result?.data && result?.data?.banners) {
      dispatch({ type: "banner", data: { banner: result?.data?.banners || [] } })
    }
  })
}

export const getCategories = () => async (dispatch) => {
  Api.getCategories({}, async (err, result) => {
    if (result && result?.data && result?.data?.categories) {
      dispatch({ type: "categories", data: { categories: result?.data?.categories || [] } })
    }
  })
}

export const getProducts = (args, isRefresh) => async (dispatch) => {
  isRefresh ? dispatch({ type: "productRefresh", data: true }) : dispatch({ type: "productLoding", data: true })
  Api.getProducts(args, async (err, result) => {
    if (result && result?.data && result?.data?.products && result?.data?.products.length > 0) {
      dispatch({ type: "products", data: { products: result?.data?.products, totalProduct: result?.data?.totalProduct, ...args } })
    } else {
      dispatch({ type: "products", data: { products: [], totalProduct: 0 } })
    }
  })
}

export const getPopularProducts = (args, isRefresh) => async (dispatch) => {
  isRefresh ? dispatch({ type: "popularProductRefresh", data: true }) : dispatch({ type: "popularProductLoding", data: true })
  Api.getProducts(args, async (err, result) => {
    if (result && result?.data && result?.data?.products && result?.data?.products.length > 0) {
      dispatch({ type: "popularProducts", data: { popularProducts: result?.data?.products, totalPopularProduct: result?.data?.totalProduct, ...args } })
    } else {
      dispatch({ type: "popularProducts", data: { popularProducts: [], totalPopularProduct: 0 } })
    }
  })
}

export const getUserAddresses = () => async (dispatch) => {
  Api.getUserAddresses(async (err, result) => {
    if (result && result?.data && result?.data?.addresses && result?.data?.addresses.length > 0) {
      dispatch({ type: "UserAddresses", data: { UserAddresses: result?.data?.addresses } })
    } else {
      dispatch({ type: "UserAddresses", data: { UserAddresses: [] } })
    }
  })
}

export const getWishlistProducts = () => async (dispatch) => {
  Api.getWishlistProducts(async (err, result) => {
    if (result && result?.data && result?.data?.products && result?.data?.products.length > 0) {
      dispatch({ type: "WishListProduct", data: { WishListProduct: result?.data?.products } })
    } else {
      dispatch({ type: "WishListProduct", data: { WishListProduct: [] } })
    }
  })
}

export const getCart = (userId) => async (dispatch) => {
  if (userId) {
    dispatch({ type: "cartLoading", data: true })
    Api.getCart({ userId }, async (err, result) => {
      if (result && result?.data && result.data.cart) {
        dispatch({ type: "setCart", data: result.data.cart })
      } else {
        dispatch({ type: "setCart", data: { products: [] } })
      }
    })
  } else {
    dispatch({ type: "setCart", data: { products: [] } })
  }
}

export const updateCart = (product, quantity) => {
  return {
    type: "updateCart",
    data: { product, quantity }
  }
}

export const setToken = (token) => {
  return {
    type: "SET_TOKEN",
    token
  }
}

export const removeToken = (token) => {
  return {
    type: "REMOVE_TOKEN",
    token
  }
}

export const setTempUserId = (tempUserId) => {
  return {
    type: "TEMP_USERID",
    tempUserId
  }
}

