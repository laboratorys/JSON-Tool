import { createDiscreteApi } from "naive-ui";
import { currentTheme } from "@/utils/theme";
export const getDiscreteApi = () => {
  const { message, notification, dialog, loadingBar, modal } =
    createDiscreteApi(
      ["message", "dialog", "notification", "loadingBar", "modal"],
      {
        configProviderProps: {
          theme: currentTheme.value,
        } as any,
      }
    );
  return { message, notification, dialog, loadingBar, modal };
};
