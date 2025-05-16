import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Picker from "./emoji_picker";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useWebSocketStore } from "./lib/websocket-service";

const webSocketStore = useWebSocketStore.getState();
webSocketStore.connect();

window.addEventListener("beforeunload", () => {
  webSocketStore.disconnect();
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/picker",
    element: <Picker />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
