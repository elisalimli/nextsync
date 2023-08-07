import React from "react";
import { createContext } from "react";

interface IModalVisible {
  saveFile?: boolean;
  delete?: boolean;
}

interface ModalContextType {
  modalVisible: IModalVisible;
  setModalVisible: (modalVisible: IModalVisible) => void;
}
export const ModalContext = createContext<ModalContextType>({
  modalVisible: {},
  setModalVisible: function (modalVisible: IModalVisible): void {},
});

export function useModal() {
  return React.useContext(ModalContext);
}
