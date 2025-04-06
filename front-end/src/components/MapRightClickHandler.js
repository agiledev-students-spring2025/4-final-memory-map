const RightClickHandler = ({ onRightClick, onLeftClick }) => {
    useMapEvent({
        contextmenu: (e) => {
            onRightClick(e.latlng);
        },
        click: () => {
            onLeftClick();
        },
    });
    return null;
};
