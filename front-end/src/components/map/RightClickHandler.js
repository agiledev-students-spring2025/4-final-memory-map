import { useMapEvent } from 'react-leaflet';

const RightClickHandler = ({ onRightClick, onLeftClick }) => {
  useMapEvent({
    dblclick: (e) => {
      onRightClick(e.latlng);
    },
    click: () => {
      onLeftClick();
    }
  });
  return null;
};

export default RightClickHandler; 