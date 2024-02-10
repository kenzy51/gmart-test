export const getActiveRouteName = (navigationState) => {
	if (!navigationState) {
		return null;
	}

  if(navigationState.routes) {
  	const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
  	if (route && route.state && route.state.routes && route.state.routes.length > 0) {
  		return getActiveRouteName(route.state);
  	}
  	return route && route.name ? route.name : null;
  } else {
    return navigationState.name ? navigationState.name : null;
  }
}
