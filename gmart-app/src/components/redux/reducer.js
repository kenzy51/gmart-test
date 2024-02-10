const initialState = {
  banner: [],
  categories: [],
  products: [],
  popularProducts: [],
  userAddress: [],
  wishListProduct: [],
  totalProduct: 0,
  totalPopularProduct: 0,
  refreshing: false,
  popularRefreshing: false,
  loading: false,
  popularLoading: false,
  user: { token: null },
  tempUserId: null,
  cart: { products: [] },
  cartLoading: false
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "banner": {
      return {
        ...state,
        banner: action.data.banner,
        bannerloading: false,
        bannerrefreshing: false
      }
    }
    case "categories": {
      return {
        ...state,
        categories: action.data.categories
      }
    }
    case "products": {
      return {
        ...state,
        products: action.data?.skip > 0 ? [...state.products, ...action.data.products] : action.data.products,
        totalProduct: action?.data?.totalProduct,
        loading: false,
        refreshing: false
      }
    }
    case "productRefresh": {
      return { ...state, refreshing: action.data }
    }
    case "productLoding": {
      return { ...state, loading: action.data }
    }
    case "popularProducts": {
      return {
        ...state,
        popularProducts: action.data?.skip > 0 ? [...state.popularProducts, ...action.data.popularProducts] : action.data.popularProducts,
        totalPopularProduct: action?.data?.totalPopularProduct,
        popularLoading: false,
        popularRefreshing: false
      }
    }
    case "popularProductLoding": {
      return { ...state, popularLoading: action.data }
    } case "popularProductRefresh": {
      return { ...state, popularRefreshing: action.data }
    } case 'authUser': {
      return { ...state, user: action?.data?.user }
    } case 'SET_TOKEN': {
      return { ...state, user: { ...state.user, token: action?.token } }
    } case 'REMOVE_TOKEN': {
      return { ...state, user: { token: null } }
    } case 'TEMP_USERID': {
      return { ...state, tempUserId: action?.tempUserId }
    } case 'UserAddresses': {
      return { ...state, userAddress: action.data.UserAddresses }
    } case 'WishListProduct': {
      return { ...state, wishListProduct: action.data.WishListProduct }
    } case 'cartLoading': {
      return { ...state, cartLoading: action.data }
    } case 'setCart': {
      return { ...state, cart: action.data, cartLoading: false }
    } case 'updateCart': {
      let products = state?.cart?.products ? [...state?.cart?.products] : []
      var index = -1;
      for (let i = 0; i < products.length; i++) {
        if (products[i]?.productId?._id === action?.data?.product?._id) {
          index = i
          break;
        }
      }
      if (index !== -1) {
        if (action.data.quantity > 0) products[index] = { productId: action?.data?.product, quantity: action?.data?.quantity }
        else products.splice(index, 1);
      } else {
        products.push({ productId: action?.data?.product, quantity: action?.data?.quantity })
      }
      return { ...state, cart: { ...state.cart, products } }
    }
    default:
      return state
  }
}