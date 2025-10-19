import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import AppNavigation from "./navigation/AppNavigation";
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigation />
      <Toast topOffset={60} visibilityTime={2500} />
    </Provider>
  );
}
